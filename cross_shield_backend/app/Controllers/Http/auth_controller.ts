import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const registerValidator = vine.compile(
      vine.object({
        fullName: vine.string(),
        email: vine.string().email().unique(async (db, value) => {
          const user = await db.from('users').where('email', value).first()
          return !user
        }),
        phone: vine.string(),
        password: vine.string().minLength(6),
        role: vine.enum(['health_practitioner', 'supplier', 'diaspora', 'beneficiary']),
        location: vine.string().optional(),
        licenseNumber: vine.string().optional(),
        businessName: vine.string().optional(),
      })
    )

    try {
      const payload = await request.validateUsing(registerValidator)

      const user = await User.create({
        ...payload,
        status: 'pending',
      })

      return response.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Registration failed',
        errors: error.messages || error.message,
      })
    }
  }

  public async login({ request, response, auth }: HttpContext) {
    const loginValidator = vine.compile(
      vine.object({
        email: vine.string().email(),
        password: vine.string(),
      })
    )

    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.verifyCredentials(email, password)

      if (user.status !== 'active') {
        return response.status(401).json({
          message: 'Account is not active. Please contact administrator.',
        })
      }

      const token = await User.accessTokens.create(user)

      return response.json({
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token: token.value!.release(),
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Login failed',
        errors: error.messages || error.message,
      })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return response.json({
        message: 'Logout successful',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Logout failed',
      })
    }
  }

  public async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      return response.json({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          location: user.location,
          licenseNumber: user.licenseNumber,
          businessName: user.businessName,
        },
      })
    } catch (error) {
      return response.status(401).json({
        message: 'Unauthorized',
      })
    }
  }
}
