// app/controllers/requests_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Request from '#models/request'
import { createUnifiedRequestValidator, CreateUnifiedRequestPayload } from '#validators/request'

export default class RequestsController {
  async index({ response }: HttpContext) {
    try {
      const requests = await Request.query()
        .preload('requestedBy', (query) => {
          query.preload('role')
        })
        .preload('assignedTo')
        .orderBy('created_at', 'desc')

      return response.json(requests)
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch requests',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const request = await Request.query()
        .where('id', params.id)
        .preload('requestedBy', (query) => {
          query.preload('role')
        })
        .preload('assignedTo')
        .firstOrFail()

      return response.json(request)
    } catch (error) {
      return response.status(404).json({
        message: 'Request not found',
      })
    }
  }

  async store({ request, auth, response }: HttpContext) {
    try {
      const user = auth.user!

      const data: CreateUnifiedRequestPayload = await request.validateUsing(
        createUnifiedRequestValidator
      )

      const { type, category, urgency, description, notes, payload } = data

      // Normalize urgency
      const urgencyMap = {
        low: 'normal',
        normal: 'normal',
        medium: 'urgent',
        urgent: 'urgent',
        high: 'emergency',
        emergency: 'emergency',
      } as const

      const normalizedUrgency = urgencyMap[urgency as keyof typeof urgencyMap]

      // Step 2: Validate payload by type
      const meds = Array.isArray(payload?.medications) ? payload.medications : []

      if (meds.length === 0) {
        return response.badRequest({
          message: 'No medications provided',
          debug: {
            payloadExists: !!payload,
            payloadType: typeof payload,
            payloadKeys: payload ? Object.keys(payload) : null,
            medicationsField: payload?.medications,
            medicationsType: typeof payload?.medications,
            isArray: Array.isArray(payload?.medications),
          },
        })
      }

      const validMeds = meds.filter((m) => {
        const hasValidName = m?.name && typeof m.name === 'string' && m.name.trim() !== ''
        const quantity = Number.parseFloat(m?.quantity)
        const hasValidQuantity = !Number.isNaN(quantity) && quantity > 0
        return hasValidName && hasValidQuantity
      })

      if (validMeds.length === 0) {
        return response.badRequest({
          message:
            'At least one valid medication is required. Each medication must have a name and quantity > 0',
          invalidMedications: meds.map((m) => ({
            name: m?.name || 'missing',
            quantity: m?.quantity || 'missing',
            issues: [
              ...(!m?.name || typeof m.name !== 'string' || m.name.trim() === ''
                ? ['Invalid name']
                : []),
              ...(Number.isNaN(Number.parseFloat(m?.quantity)) ||
              Number.parseFloat(m?.quantity) <= 0
                ? ['Invalid quantity']
                : []),
            ],
          })),
        })
      }

      // Store all medications in the existing medication field (comma-separated)
      data.medication = validMeds.map((med) => med.name.trim()).join(', ')
      // Don't set quantity for medication requests - we want individual quantities

      // Step 3: Save
      const newRequest = await Request.create({
        type,
        category,
        medications: data.medications, // Will be null/undefined for non-medication requests
        medication: data.medication, // Contains all medication names
        quantity: data.quantity, // Will be null/undefined for medication requests
        urgency: normalizedUrgency,
        description,
        notes,
        payload: payload ? JSON.stringify(payload) : null,
        status: 'pending',
        requestedById: user.id,
      })

      await newRequest.load('requestedBy', (q) => q.preload('role'))

      // Build response with medications array for frontend
      const requestResponse = newRequest.toJSON()

      // Add medications array to response for frontend display
      if (payload?.medications) {
        requestResponse.medications = payload.medications
      }

      return response.created({
        message: 'Request created successfully',
        request: requestResponse,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create request',
        error: error.messages || error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const requestRecord = await Request.findOrFail(params.id)
      const data = request.only(['status', 'assignedToId', 'notes'])

      requestRecord.merge(data)
      await requestRecord.save()

      await requestRecord.load('requestedBy', (query) => {
        query.preload('role')
      })
      await requestRecord.load('assignedTo')

      return response.json(requestRecord)
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update request',
        error: error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const requestRecord = await Request.findOrFail(params.id)
      await requestRecord.delete()

      return response.ok({ message: 'Request deleted successfully' })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to delete request',
        error: error.message,
      })
    }
  }
}
