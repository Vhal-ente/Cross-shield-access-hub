import type { HttpContext } from '@adonisjs/core/http'
import MedicationRequest from '#models/medication_request'
import User from '#models/user'
import {
  createMedicationRequestValidator,
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
      let requests

      if (user.role.name === 'super_admin') {
        requests = await MedicationRequest.query()
          .preload('user', (userQuery) => {
            userQuery.preload('role')
          })
          .preload('assignedUser', (assignedUserQuery) => {
            assignedUserQuery.preload('role')
          })
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      } else if (user.role.name === 'health_practitioner') {
        requests = await MedicationRequest.query()
          .where('assigned_to', user.id)
          .orWhere('status', 'pending')
          .preload('user', (userQuery) => {
            userQuery.preload('role')
          })
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      } else {
        requests = await MedicationRequest.query()
          .where('user_id', user.id)
          .preload('assignedUser', (assignedUserQuery) => {
            assignedUserQuery.preload('role')
          })
          .preload('beneficiary')
          .orderBy('created_at', 'desc')
      }

      // ✅ FIXED: Transform data to match frontend expectations
      const formattedRequests = requests.map((request) => ({
        id: request.id,
        type: request.type || 'Medication Request',
        requestedBy: {
          fullName: request.user?.fullName || 'Unknown User',
          role: {
            name: request.user?.role?.name || 'unknown_role',
          },
        },
        // 🔥 FORMAT MEDICATION AS READABLE STRING:
        medication: (() => {
          try {
            const medications =
              typeof request.medications === 'string'
                ? JSON.parse(request.medications)
                : request.medications

            if (!medications || !Array.isArray(medications)) {
              return 'No medications specified'
            }

            return medications.map((med) => `${med.name} (${med.quantity})`).join(', ')
          } catch (error) {
            console.error('Error parsing medication:', error)
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

      // ✅ FIXED: Use proper logging (comma instead of concatenation)
      console.log('Raw medications input:', medications)
      console.log('Type of medications:', typeof medications)

      // Handle different input formats
      if (typeof medications === 'string') {
        try {
          medications = JSON.parse(medications)
          console.log('Parsed medications:', medications)
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

      // ✅ Construct the payload
      const payload = {
        urgency: request.input('urgency'),
        notes: request.input('notes'),
        beneficiaryId: request.input('beneficiaryId') || null,
      }

      console.log('Payload being saved:', {
        ...payload,
        userId: user.id,
        status: 'pending',
        medications: medications, // Log the actual array
        beneficiaryId: payload.beneficiaryId || null,
        notes: payload.notes ?? null,
      })

      const prescriptionImage = request.file('prescriptionImage')

      // ✅ Create the medication request
      const medicationRequest = await MedicationRequest.create({
        ...payload,
        userId: user.id,
        status: 'pending',
        medications: medications, // Make sure this is the parsed array
        beneficiaryId: payload.beneficiaryId || null,
        notes: payload.notes ?? null,
      })

      console.log('Created medication request with ID:', medicationRequest.id)

      // ✅ Handle optional image upload
      if (prescriptionImage) {
        try {
          await prescriptionImage.move('./prescriptions')
          medicationRequest.prescriptionImage = prescriptionImage.fileName || null
          await medicationRequest.save()
          console.log('Prescription image saved:', prescriptionImage.fileName)
        } catch (imageError) {
          console.error('Error saving prescription image:', imageError)
          // Don't fail the entire request for image upload issues
        }
      }

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
  public async show({ params, response, auth }: HttpContext) {
    try {
      const authenticatedUser = await auth.authenticate()

      // ✅ FIXED: Load user with role
      const user = await User.query()
        .where('id', authenticatedUser.id)
        .preload('role')
        .firstOrFail()

      const request = await MedicationRequest.query()
        .where('id', params.id)
        .preload('user', (userQuery) => {
          userQuery.preload('role')
        })
        .preload('assignedUser')
        .preload('beneficiary')
        .firstOrFail()

      // Check authorization
      if (
        user.role.name !== 'super_admin' &&
        request.userId !== user.id &&
        request.assignedTo !== user.id
      ) {
        return response.status(403).json({
          message: 'Unauthorized to view this request',
        })
      }

      return response.json({
        request,
      })
    } catch (error) {
      console.error('Error fetching medication request:', error)
      return response.status(404).json({
        message: 'Request not found',
      })
    }
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
}
