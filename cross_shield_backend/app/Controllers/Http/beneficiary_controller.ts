import type { HttpContext } from '@adonisjs/core/http'
import Beneficiary from '#models/beneficiary'
import { createBeneficiaryValidator, updateBeneficiaryValidator } from '#validators/beneficiary'
import { DateTime } from 'luxon'

export default class BeneficiariesController {
  public async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      await user.load('role')

      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      if (user.role.name === 'super_admin') {
        const beneficiaries = await Beneficiary.query()
          .preload('diaspora')
          .orderBy('created_at', 'desc')
          .paginate(page, limit)

        return response.json({
          data: beneficiaries.all(),
          meta: beneficiaries.getMeta(),
        })
      }

      if (user.role.name === 'diaspora') {
        const beneficiaries = await Beneficiary.query()
          .where('diaspora_id', user.id)
          .preload('diaspora')
          .orderBy('created_at', 'desc')
          .paginate(page, limit)

        return response.json({
          data: beneficiaries.all(),
          meta: beneficiaries.getMeta(),
        })
      }

      return response.status(403).json({ message: 'Unauthorized to view beneficiaries' })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch beneficiaries',
        error: error.message,
      })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    await user.load('role')

    if (user.role.name !== 'diaspora') {
      return response.status(403).json({
        message: 'Only diaspora users can create beneficiaries',
      })
    }

    try {
      const payload = await request.validateUsing(createBeneficiaryValidator)
      const beneficiary = await Beneficiary.create({
        ...payload,
        diasporaId: user.id,
        status: 'active',
        referred: false,
        referralNote: null,
        referredAt: null,
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
    const user = auth.user!
    await user.load('role')
    try {
      const beneficiary = await Beneficiary.query()
        .where('id', params.id)
        .preload('diaspora')
        .firstOrFail()

      // Check authorization
      if (user.role.name !== 'super_admin' && beneficiary.diasporaId !== user.id) {
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
    const user = auth.user!
    await user.load('role')

    try {
      const payload = await request.validateUsing(updateBeneficiaryValidator)
      const beneficiary = await Beneficiary.findOrFail(params.id)

      // Check authorization
      if (user.role.name !== 'super_admin' && beneficiary.diasporaId !== user.id) {
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
    const user = auth.user!
    await user.load('role')
    try {
      const beneficiary = await Beneficiary.findOrFail(params.id)
      // Check authorization
      if (user.role.name !== 'super_admin' && beneficiary.diasporaId !== user.id) {
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

  // referral endpoint
  public async refer({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    await user.load('role')

    if (user.role.name !== 'diaspora') {
      return response.status(403).json({ message: 'Only diaspora users refer patients' })
    }

    try {
      const beneficiary = await Beneficiary.findOrFail(params.id)
      if (beneficiary.diasporaId !== user.id) {
        return response.status(403).json({ message: 'Unauthorized to refer this beneficiary' })
      }

      const referralNote = request.input('referral_note') || null
      beneficiary.merge({
        referred: true,
        referralNote,
        referredAt: DateTime.local(),
      })
      await beneficiary.save()
      return response.json({ message: 'Beneficiary referred successfully', beneficiary })
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Failed to refer beneficiary', errors: error.messages || error.message })
    }
  }
}
