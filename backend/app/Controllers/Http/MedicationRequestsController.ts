import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MedicationRequest from 'App/Models/MedicationRequest'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class MedicationRequestsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user!
      let requests

      if (user.role === 'super_admin') {
        requests = await MedicationRequest.query()
          .preload('user')
          .preload('assignedUser')
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      } else if (user.role === 'health_practitioner') {
        requests = await MedicationRequest.query()
          .where('assigned_to', user.id)
          .orWhere('status', 'pending')
          .preload('user')
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      } else {
        requests = await MedicationRequest.query()
          .where('user_id', user.id)
          .preload('assignedUser')
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      }

      return response.json({
        requests
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch requests',
        error: error.message
      })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const requestSchema = schema.create({
      medicationName: schema.string({}, [rules.required()]),
      quantity: schema.number([rules.required(), rules.unsigned()]),
      urgency: schema.enum(['normal', 'urgent', 'emergency'] as const),
      medicalCondition: schema.string.optional(),
      notes: schema.string.optional(),
      beneficiaryId: schema.number.optional([rules.unsigned()]),
    })

    try {
      const payload = await request.validate({ schema: requestSchema })
      const user = auth.user!

      const medicationRequest = await MedicationRequest.create({
        ...payload,
        userId: user.id,
        status: 'pending'
      })

      await medicationRequest.load('user')
      await medicationRequest.load('beneficiary')

      return response.status(201).json({
        message: 'Medication request created successfully',
        request: medicationRequest
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create request',
        errors: error.messages || error.message
      })
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
      const request = await MedicationRequest.query()
        .where('id', params.id)
        .preload('user')
        .preload('assignedUser')
        .preload('beneficiary')
        .firstOrFail()

      // Check authorization
      if (user.role !== 'super_admin' && 
          request.userId !== user.id && 
          request.assignedTo !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to view this request'
        })
      }

      return response.json({
        request
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Request not found'
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const updateSchema = schema.create({
      status: schema.enum.optional(['pending', 'in_progress', 'fulfilled', 'cancelled'] as const),
      assignedTo: schema.number.optional([rules.unsigned()]),
      price: schema.number.optional([rules.unsigned()]),
      notes: schema.string.optional(),
    })

    try {
      const payload = await request.validate({ schema: updateSchema })
      const user = auth.user!
      
      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && 
          user.role !== 'health_practitioner' &&
          medicationRequest.userId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this request'
        })
      }

      medicationRequest.merge(payload)
      await medicationRequest.save()

      await medicationRequest.load('user')
      await medicationRequest.load('assignedUser')
      await medicationRequest.load('beneficiary')

      return response.json({
        message: 'Request updated successfully',
        request: medicationRequest
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update request',
        errors: error.messages || error.message
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && medicationRequest.userId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to delete this request'
        })
      }

      await medicationRequest.delete()

      return response.json({
        message: 'Request deleted successfully'
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Request not found'
      })
    }
  }
}