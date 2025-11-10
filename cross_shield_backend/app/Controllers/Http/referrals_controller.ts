import { HttpContext } from '@adonisjs/core/http'
import Referral from '#models/referral'
import crypto from 'node:crypto'

/**
 * Generate a short random code.
 * Uses crypto for unpredictability.
 */
function generateCode(length = 8) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase()
}

// Try to produce a unique referral code.
// Tries a few times against the DB to avoid collisions.

async function uniqueReferralCode(maxAttempts = 6) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateCode(8)
    const exists = await Referral.query().where('referral_code', code).first()
    if (!exists) return code
  }

  // fallback
  return `R${Date.now().toString(36).toUpperCase()}`
}

export default class ReferralsController {
  // Create a new referral
  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ message: 'Login required' })

    const payload = request.only([
      'referredName',
      'referredPhone',
      'referredEmail',
      'referredAddress',
      'referralType',
      'metadata',
    ])

    try {
      const referralCode = await uniqueReferralCode()

      const referral = await Referral.create({
        userId: user.id,
        referredName: payload.referredName,
        referredPhone: payload.referredPhone,
        referredEmail: payload.referredEmail,
        referredAddress: payload.referredAddress,
        referralType: payload.referralType,
        metadata: payload.metadata ?? null,
        status: 'active',
        referralCode,
      })

      return response.created({ message: 'Referral recorded', referral })
    } catch (err) {
      return response.status(500).json({ message: 'Failed to record referral', error: err.message })
    }
  }

  // List all referrals for current user
  public async index({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ message: 'Login required' })

    const referrals = await Referral.query().where('user_id', user.id).orderBy('created_at', 'desc')

    return response.ok({ referrals })
  }

  // Optionally, admin can view all referrals
  public async all({ response }: HttpContext) {
    const referrals = await Referral.query().preload('user').orderBy('created_at', 'desc')
    return response.ok({ referrals })
  }

  // GET /api/referrals/code/:code
  // public lookup by referral code
  public async findByCode({ params, response }: HttpContext) {
    const code = params.code
    const referral = await Referral.query().where('referral_code', code).first()
    if (!referral) return response.notFound({ message: 'Referral not found' })
    return response.ok({ referral })
  }

  // POST /api/referrals/code/:code/redeem
  // redeem links the currently authenticated user to the referral
  public async redeem({ params, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ message: 'Login required to redeem' })

    const code = params.code
    const referral = await Referral.query().where('referral_code', code).first()
    if (!referral) return response.notFound({ message: 'Referral not found' })

    if (referral.referredUserId) {
      return response.conflict({ message: 'Referral code already redeemed' })
    }

    referral.referredUserId = user.id
    // optional: mark processed or keep active depending on your workflow
    referral.status = 'processed'
    await referral.save()

    return response.ok({ message: 'Referral redeemed', referral })
  }
}
