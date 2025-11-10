import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import MedicationRequest from '#models/medication_request'
import User from '#models/user'
import {
  // createMedicationRequestValidator,
  updateMedicationRequestValidator,
} from '#validators/medication_request'

export default class MedicationRequestsController {
  public async index({ auth, response }: HttpContext) {
    try {
      const authenticatedUser = await auth.authenticate()

      // ✅ FIXED: Load the role relationship
      const user = await User.query()
        .where('id', authenticatedUser.id)
        .preload('role')
        .firstOrFail()

      let requests: MedicationRequest[] = []

      if (user.role.name === 'super_admin') {
        requests = await MedicationRequest.query()
          .preload('user', (q) => q.preload('role'))
          .preload('assignedUser', (q) => q.preload('role'))
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      } else if (user.role.name === 'health_practitioner') {
        requests = await MedicationRequest.query()
          .where('assigned_to', user.id)
          .orWhere('status', 'pending')
          .preload('user', (q) => q.preload('role'))
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      } else {
        // Regular users and beneficiaries: include requests created by the user
        // or requests where the user is the beneficiary
        requests = await MedicationRequest.query()
          .where((query) => {
            query.where('user_id', user.id).orWhere('beneficiary_id', user.id)
          })
          .preload('user', (q) => q.preload('role'))
          .preload('assignedUser', (q) => q.preload('role'))
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      }

      // ✅ FIXED: Transform data to match frontend expectations
      const formattedRequests = requests.map((request) => ({
        id: request.id,
        type: 'Medication Request',
        requestedBy: {
          fullName: request.user?.fullName || 'Unknown User',
          role: { name: request.user?.role?.name || 'unknown_role' },
        },
        // 🔥 FORMAT MEDICATION AS READABLE STRING:
        medication: (() => {
          try {
            const meds = Array.isArray(request.medications)
              ? request.medications
              : typeof request.medications === 'string'
                ? JSON.parse(request.medications)
                : []

            if (!Array.isArray(meds) || meds.length === 0) return 'No medications specified'
            return meds.map((m) => `${m.name} (${m.quantity})`).join(', ')
          } catch {
            return 'Invalid medication data'
          }
        })(),
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        assignedTo: request.assignedUser
          ? {
              fullName: request.assignedUser.fullName,
            }
          : undefined,
        urgency: request.urgency,
        notes: request.notes,
        beneficiary: request.beneficiary,
      }))

      return response.json(formattedRequests)
    } catch (error) {
      console.error('Error in medication requests index:', error)
      return response.status(500).json({
        message: 'Failed to fetch requests',
        error: error.message,
      })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    try {
      const authenticatedUser = await auth.authenticate()

      const user = await User.query()
        .where('id', authenticatedUser.id)
        .preload('role')
        .firstOrFail()

      // ✅ FIXED: Proper handling of medications input
      let medications = request.input('medications')

      // Handle different input formats
      if (typeof medications === 'string') {
        try {
          medications = JSON.parse(medications)
          // console.log('Parsed medications:', medications)
        } catch (err) {
          console.error('Failed to parse medications JSON:', err.message)
          return response.badRequest({
            message: 'Invalid medications format',
            details: err.message,
          })
        }
      }

      // ✅ FIXED: Additional validation
      if (!medications) {
        return response.badRequest({
          message: 'Medications field is required',
        })
      }

      if (!Array.isArray(medications)) {
        return response.badRequest({
          message: 'The medications field must be an array',
        })
      }

      if (medications.length === 0) {
        return response.badRequest({
          message: 'At least one medication is required',
        })
      }

      // Validate each medication object
      for (const med of medications) {
        if (!med || typeof med !== 'object') {
          return response.badRequest({
            message: 'Each medication must be an object',
          })
        }
        if (!med.name || !med.quantity) {
          return response.badRequest({
            message: 'Each medication must have name and quantity',
          })
        }
        if (med.quantity <= 0) {
          return response.badRequest({
            message: 'Medication quantity must be greater than 0',
          })
        }
      }

      // ✅ Add default unit before saving
      medications = medications.map((med) => ({
        ...med,
        unit: med.unit || 'Pack',
      }))

      // ✅ Construct the payload
      const payload = {
        urgency: request.input('urgency'),
        notes: request.input('notes'),
        beneficiaryId: request.input('beneficiaryId') || null,
      }

      // Handle multiple images
      const prescriptionImages = request.files('prescriptionImages', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      const uploadedImageNames: string[] = []

      for (const image of prescriptionImages) {
        if (!image.isValid) {
          console.error('Invalid file:', image.errors)
          continue
        }
        try {
          await image.move('uploads/prescriptions')
          uploadedImageNames.push(image.fileName || '')
        } catch (err) {
          console.error('Error saving prescription image:', err)
        }
      }

      // after processing uploadedImageNames array
      const prescriptionImagesValue =
        uploadedImageNames.length > 0 ? JSON.stringify(uploadedImageNames) : null

      const medicationRequest = await MedicationRequest.create({
        ...payload,
        userId: user.id,
        status: 'pending',
        medications: medications,
        beneficiaryId: payload.beneficiaryId || null,
        notes: payload.notes ?? null,
        prescriptionImages: prescriptionImagesValue,
      })

      console.log('Created medication request with ID:', medicationRequest.id)

      // ✅ Load relationships
      await medicationRequest.load('user')
      await medicationRequest.load('beneficiary')

      console.log('Medication request created successfully')

      return response.status(201).json({
        message: 'Medication request created successfully',
        request: medicationRequest,
      })
    } catch (error) {
      // ✅ FIXED: Proper error logging and response
      console.error('Error creating medication request:', error)

      // Check if it's a validation error
      if (error.messages) {
        return response.status(400).json({
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      // Check if it's a database error
      if (error.code) {
        console.error('Database error code:', error.code)
        return response.status(500).json({
          message: 'Database error occurred',
          error: 'Please check server logs for details',
        })
      }

      // Generic error
      return response.status(500).json({
        message: 'Failed to create request',
        error: error.message || 'Unknown error occurred',
      })
    }
  }

  // public async show({ params, response, auth }: HttpContext) {
  //   try {
  //     const authenticatedUser = await auth.authenticate()

  //     // ✅ FIXED: Load user with role
  //     const user = await User.query()
  //       .where('id', authenticatedUser.id)
  //       .preload('role')
  //       .firstOrFail()

  //     const request = await MedicationRequest.query()
  //       .where('id', params.id)
  //       .preload('user', (userQuery) => {
  //         userQuery.preload('role')
  //       })
  //       .preload('assignedUser')
  //       .preload('beneficiary')
  //       .firstOrFail()

  //     // Check authorization
  //     if (
  //       user.role.name !== 'super_admin' &&
  //       request.userId !== user.id &&
  //       request.assignedTo !== user.id
  //     ) {
  //       return response.status(403).json({
  //         message: 'Unauthorized to view this request',
  //       })
  //     }

  //     return response.json({
  //       request,
  //     })
  //   } catch (error) {
  //     console.error('Error fetching medication request:', error)
  //     return response.status(404).json({
  //       message: 'Request not found',
  //     })
  //   }
  // }
  public async show({ params, response, auth }: HttpContext) {
    // authenticate
    let authUser
    try {
      authUser = await auth.authenticate()
    } catch (err) {
      console.warn('MedicationRequests.show auth failed:', err.message)
      return response.unauthorized({ message: 'Not authenticated' })
    }

    // load user + role
    let user
    try {
      user = await User.query().where('id', authUser.id).preload('role').firstOrFail()
    } catch (err) {
      console.error('MedicationRequests.show failed loading user:', err)
      return response.status(500).json({ message: 'Failed to load user' })
    }

    // find the request (simple find to avoid preload errors hiding the cause)
    let medicationRequest
    try {
      medicationRequest = await MedicationRequest.find(params.id)
      if (!medicationRequest) {
        console.info(`MedicationRequests.show not found id=${params.id}`)
        return response.status(404).json({ message: 'Request not found' })
      }
    } catch (err) {
      console.error('MedicationRequests.show DB lookup error:', err)
      return response.status(500).json({ message: 'Database error', error: err.message })
    }

    // attempt to preload relations, but do not fail on preload errors
    try {
      await medicationRequest.load('user', (q) => q.preload('role'))
      await medicationRequest.load('assignedUser', (q) => q.preload('role'))
      await medicationRequest.load('beneficiary')
    } catch (warn) {
      console.warn('MedicationRequests.show preload warning:', warn)
    }

    // authorization: super_admin OR owner OR assigned user
    const roleName = user.role?.name ?? ''
    const isOwner = medicationRequest.userId === user.id
    const assignedTo =
      // support both camelCase and snake_case fields if model/db differs
      (medicationRequest as any).assignedTo ?? (medicationRequest as any).assigned_to
    const isAssigned = assignedTo === user.id

    if (roleName !== 'super_admin' && !isOwner && !isAssigned) {
      return response.status(403).json({ message: 'Unauthorized to view this request' })
    }

    return response.ok({ request: medicationRequest })
  }

  public async update({ params, request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateMedicationRequestValidator)
      const authenticatedUser = await auth.authenticate()

      // ✅ FIXED: Load user with role
      const user = await User.query()
        .where('id', authenticatedUser.id)
        .preload('role')
        .firstOrFail()

      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // Check authorization
      if (
        user.role.name !== 'super_admin' &&
        user.role.name !== 'health_practitioner' &&
        medicationRequest.userId !== user.id
      ) {
        return response.status(403).json({
          message: 'Unauthorized to update this request',
        })
      }

      medicationRequest.merge(payload)
      await medicationRequest.save()

      await medicationRequest.load('user')
      await medicationRequest.load('assignedUser')
      await medicationRequest.load('beneficiary')

      return response.json({
        message: 'Request updated successfully',
        request: medicationRequest,
      })
    } catch (error) {
      console.error('Error updating medication request:', error)
      return response.status(400).json({
        message: 'Failed to update request',
        errors: error.messages || error.message,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const authenticatedUser = await auth.authenticate()

      // ✅ FIXED: Load user with role
      const user = await User.query()
        .where('id', authenticatedUser.id)
        .preload('role')
        .firstOrFail()

      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // Check authorization
      if (user.role.name !== 'super_admin' && medicationRequest.userId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to delete this request',
        })
      }

      await medicationRequest.delete()

      return response.json({
        message: 'Request deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting medication request:', error)
      return response.status(404).json({
        message: 'Request not found',
      })
    }
  }

  // GET /medication-requests/assigned
  // returns requests assigned to the authenticated user
  public async assignedList({ auth, response }: HttpContext) {
    try {
      const authUser = await auth.authenticate()

      const user = await User.query().where('id', authUser.id).preload('role').firstOrFail()

      const requests = await MedicationRequest.query()
        .where('assigned_to', user.id)
        .preload('user', (q) => q.preload('role'))
        .preload('beneficiary')
        .orderBy('created_at', 'desc')

      return response.ok({ requests })
    } catch (err) {
      console.error('Error loading assigned requests', err)
      return response.status(500).json({ message: 'Failed to load assigned requests' })
    }
  }

  // POST /medication-requests/:id/assign
  // body: { assignedTo: number }  (user id of supplier/practitioner)
  public async assign({ params, request, response, auth }: HttpContext) {
    try {
      // authenticate
      const authUser = await auth.authenticate()
      const user = await User.query().where('id', authUser.id).preload('role').firstOrFail()

      // permission check
      if (user.role.name !== 'super_admin' && user.role.name !== 'admin') {
        return response.forbidden({ message: 'Not allowed to assign requests' })
      }

      // find request
      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // read assigned user id from request (support camelCase or snake_case)
      const assignedToRaw = request.input('assignedTo') ?? request.input('assigned_to')
      const assignedTo = Number(assignedToRaw)
      if (!assignedTo || Number.isNaN(assignedTo)) {
        return response.badRequest({
          message: 'assignedTo is required and must be a valid user id',
        })
      }

      // ensure assigned user exists
      const assignedUser = await User.find(assignedTo)
      if (!assignedUser)
        return response.badRequest({ message: 'Assigned user not found' })

        // write to model using both possible property names; avoid TypeScript complaints with a cast
      ;(medicationRequest as any).assignedTo = assignedUser.id
      ;(medicationRequest as any).assigned_to = assignedUser.id
      const curr = (medicationRequest as any).status as string | undefined
      if (!curr || curr === 'pending') {
        ;(medicationRequest as any).status = 'in_progress'
      }

      await medicationRequest.save()

      // preload relations for response
      try {
        await medicationRequest.load('assignedUser')
        await medicationRequest.load('user')
        await medicationRequest.load('beneficiary')
      } catch (warn) {
        console.warn('Preload warning after assign:', warn)
      }

      return response.ok({
        message: 'Request assigned',
        request: medicationRequest,
      })
    } catch (err: any) {
      console.error('Error assigning request', err)
      // if failure came from findOrFail it will be thrown; surface helpful message
      return response
        .status(500)
        .json({ message: 'Failed to assign request', error: err.message ?? err })
    }
  }

  // POST /medication-requests/:id/fulfill
  public async fulfill({ params, request, response, auth }: HttpContext) {
    try {
      const authUser = await auth.authenticate()
      const user = await User.query().where('id', authUser.id).preload('role').firstOrFail()

      const medicationRequest = await MedicationRequest.query()
        .where('id', params.id)
        .preload('assignedUser')
        .firstOrFail()

      // Authorization: assigned user or super admin
      const assignedTo =
        (medicationRequest as any).assignedTo ?? (medicationRequest as any).assigned_to
      if (user.role.name !== 'super_admin' && assignedTo !== user.id) {
        return response.forbidden({ message: 'Not allowed to fulfill this request' })
      }

      // Server-side duplicate check
      if ((medicationRequest as any).status === 'fulfilled') {
        return response.conflict({ message: 'Request already fulfilled' })
      }

      // Use a transaction to safely update and record audit info
      await db.transaction(async (trx) => {
        // bind instance to transaction
        ;(medicationRequest as any).useTransaction?.(trx)

        // set status and fulfillment fields
        ;(medicationRequest as any).status = 'fulfilled'
        ;(medicationRequest as any).fulfilledBy = user.id
        ;(medicationRequest as any).fulfilledAt = DateTime.local()
        const note = request.input('note')
        if (note) (medicationRequest as any).fulfillmentNote = note

        await medicationRequest.save()
      })

      // reload relations
      try {
        await medicationRequest.load('user')
        await medicationRequest.load('assignedUser')
        await medicationRequest.load('beneficiary')
      } catch (warn) {
        console.warn('Preload warning after fulfill:', warn)
      }

      return response.ok({ message: 'Request marked fulfilled', request: medicationRequest })
    } catch (err: any) {
      console.error('Error fulfilling request', err)
      return response
        .status(500)
        .json({ message: 'Failed to mark as fulfilled', error: err.message ?? err })
    }
  }
}
