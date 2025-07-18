import type { HttpContext } from '@adonisjs/core/http'
import MedicationRequest from '#models/medication_request'
import vine from '@vinejs/vine'

export default class MedicationRequestsController {
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
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
        requests,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch requests',
        error: error.message.errors,
      })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    const requestValidator = vine.compile(vine.object({
      medicationName: vine.string(),
      quantity: vine.number().positive(),
      urgency: vine.enum(['normal', 'urgent', 'emergency']),
      medicalCondition: vine.string().optional(),
      notes: vine.string().optional(),
      beneficiaryId: vine.number().positive().optional(),
    }))

    try {
      const payload = await request.validateUsing(requestValidator)
      const user = auth.getUserOrFail()

      const medicationRequest = await MedicationRequest.create({
        ...payload,
        userId: user.id,
        status: 'pending',
      })

      await medicationRequest.load('user')
      await medicationRequest.load('beneficiary')

      return response.status(201).json({
        message: 'Medication request created successfully',
        request: medicationRequest,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create request',
        errors: error.messages || error.message,
      })
    }
  }

  public async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const request = await MedicationRequest.query()
        .where('id', params.id)
        .preload('user')
        .preload('assignedUser')
        .preload('beneficiary')
        .firstOrFail()

      // Check authorization
      if (
        user.role !== 'super_admin' &&
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
      return response.status(404).json({
        message: 'Request not found',
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const updateValidator = vine.compile(vine.object({
      status: vine.enum(['pending', 'in_progress', 'fulfilled', 'cancelled']).optional(),
      assignedTo: vine.number().positive().optional(),
      price: vine.number().positive().optional(),
      notes: vine.string().optional(),
    }))

    try {
      const payload = await request.validateUsing(updateValidator)
      const user = auth.getUserOrFail()

      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // Check authorization
      if (
        user.role !== 'super_admin' &&
        user.role !== 'health_practitioner' &&
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
      return response.status(400).json({
        message: 'Failed to update request',
        errors: error.messages || error.message,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const medicationRequest = await MedicationRequest.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && medicationRequest.userId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to delete this request',
        })
      }

      await medicationRequest.delete()

      return response.json({
        message: 'Request deleted successfully',
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Request not found',
      })
    }
  }
}
    })

    try {
      const payload = await request.validate({ schema: requestSchema })
      const user = auth.user!

      const medicationRequest = await MedicationRequest.create({
        ...payload,
        userId: user.id,
        status: 'pending',
      })

      await medicationRequest.load('user')
      await medicationRequest.load('beneficiary')

      return response.status(201).json({
        message: 'Medication request created successfully',
        request: medicationRequest,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create request',
        errors: error.messages.errors || error.message.errors,
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
      if (
        user.role !== 'super_admin' &&
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
      return response.status(404).json({
        message: 'Request not found',
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
      if (
        user.role !== 'super_admin' &&
        user.role !== 'health_practitioner' &&
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
      return response.status(400).json({
        message: 'Failed to update request',
        errors: error.messages.errors || error.message.errors,
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
          message: 'Unauthorized to delete this request',
        })
      }

      await medicationRequest.delete()

      return response.json({
        message: 'Request deleted successfully',
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Request not found',
      })
    }
  }
}
