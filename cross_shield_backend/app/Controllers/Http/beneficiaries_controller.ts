import type { HttpContext } from '@adonisjs/core/http'
import Beneficiary from '#models/beneficiary'
import vine from '@vinejs/vine'

export default class BeneficiariesController {
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      let beneficiaries

      if (user.role === 'super_admin') {
        beneficiaries = await Beneficiary.query().preload('diaspora').orderBy('created_at', 'desc')
      } else if (user.role === 'diaspora') {
        beneficiaries = await Beneficiary.query()
          .where('diaspora_id', user.id)
          .orderBy('created_at', 'desc')
      } else {
        return response.status(403).json({
          message: 'Unauthorized to view beneficiaries',
        })
      }

      return response.json({
        beneficiaries,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch beneficiaries',
        error: error.message.errors,
      })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    const beneficiaryValidator = vine.compile(vine.object({
      name: vine.string(),
      phone: vine.string(),
      location: vine.string(),
      medicationNeeds: vine.string().optional(),
    }))

    try {
      const payload = await request.validateUsing(beneficiaryValidator)
      const user = auth.getUserOrFail()

      if (user.role !== 'diaspora') {
        return response.status(403).json({
          message: 'Only diaspora users can create beneficiaries',
        })
      }

      const beneficiary = await Beneficiary.create({
        ...payload,
        diasporaId: user.id,
        status: 'active',
      })

      await beneficiary.load('diaspora')

      return response.status(201).json({
        message: 'Beneficiary created successfully',
        beneficiary,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create beneficiary',
        errors: error.messages || error.message,
      })
    }
  }

  public async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const beneficiary = await Beneficiary.query()
        .where('id', params.id)
        .preload('diaspora')
        .firstOrFail()

      // Check authorization
      if (user.role !== 'super_admin' && beneficiary.diasporaId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to view this beneficiary',
        })
      }

      return response.json({
        beneficiary,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Beneficiary not found',
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const updateValidator = vine.compile(vine.object({
      name: vine.string().optional(),
      phone: vine.string().optional(),
      location: vine.string().optional(),
      medicationNeeds: vine.string().optional(),
      status: vine.enum(['active', 'inactive']).optional(),
    }))

    try {
      const payload = await request.validateUsing(updateValidator)
      const user = auth.getUserOrFail()

      const beneficiary = await Beneficiary.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && beneficiary.diasporaId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this beneficiary',
        })
      }

      beneficiary.merge(payload)
      await beneficiary.save()

      await beneficiary.load('diaspora')

      return response.json({
        message: 'Beneficiary updated successfully',
        beneficiary,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update beneficiary',
        errors: error.messages || error.message,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const beneficiary = await Beneficiary.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && beneficiary.diasporaId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to delete this beneficiary',
        })
      }

      await beneficiary.delete()

      return response.json({
        message: 'Beneficiary deleted successfully',
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Beneficiary not found',
      })
    }
  }
}
    })

    try {
      const payload = await request.validate({ schema: beneficiarySchema })
      const user = auth.user!

      if (user.role !== 'diaspora') {
        return response.status(403).json({
          message: 'Only diaspora users can create beneficiaries',
        })
      }

      const beneficiary = await Beneficiary.create({
        ...payload,
        diasporaId: user.id,
        status: 'active',
      })

      await beneficiary.load('diaspora')

      return response.status(201).json({
        message: 'Beneficiary created successfully',
        beneficiary,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create beneficiary',
        errors: error.messages.errors || error.message.errors,
      })
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
      const beneficiary = await Beneficiary.query()
        .where('id', params.id)
        .preload('diaspora')
        .firstOrFail()

      // Check authorization
      if (user.role !== 'super_admin' && beneficiary.diasporaId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to view this beneficiary',
        })
      }

      return response.json({
        beneficiary,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Beneficiary not found',
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const updateSchema = schema.create({
      name: schema.string.optional(),
      phone: schema.string.optional(),
      location: schema.string.optional(),
      medicationNeeds: schema.string.optional(),
      status: schema.enum.optional(['active', 'inactive'] as const),
    })

    try {
      const payload = await request.validate({ schema: updateSchema })
      const user = auth.user!

      const beneficiary = await Beneficiary.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && beneficiary.diasporaId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this beneficiary',
        })
      }

      beneficiary.merge(payload)
      await beneficiary.save()

      await beneficiary.load('diaspora')

      return response.json({
        message: 'Beneficiary updated successfully',
        beneficiary,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update beneficiary',
        errors: error.messages.errors || error.message.errors,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
      const beneficiary = await Beneficiary.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && beneficiary.diasporaId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to delete this beneficiary',
        })
      }

      await beneficiary.delete()

      return response.json({
        message: 'Beneficiary deleted successfully',
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Beneficiary not found',
      })
    }
  }
}
