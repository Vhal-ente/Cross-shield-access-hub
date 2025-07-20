import type { HttpContext } from '@adonisjs/core/http'
import Beneficiary from '#models/beneficiary'
import User from '#models/user'
import { createBeneficiaryValidator, updateBeneficiaryValidator } from '#validators/beneficiary'

export default class BeneficiariesController {
  public async index({ response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User
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
        error: error.message,
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createBeneficiaryValidator)
      const user = (response as any).locals.user as User

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

  public async show({ params, response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User
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

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateBeneficiaryValidator)
      const user = (response as any).locals.user as User

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

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User
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
