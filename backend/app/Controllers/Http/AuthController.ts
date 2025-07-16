import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const registerSchema = schema.create({
      fullName: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      phone: schema.string({}, [rules.required()]),
      password: schema.string({}, [rules.minLength(6)]),
      role: schema.enum(['health_practitioner', 'supplier', 'diaspora', 'beneficiary'] as const),
      location: schema.string.optional(),
      licenseNumber: schema.string.optional(),
      businessName: schema.string.optional(),
    })

    try {
      const payload = await request.validate({ schema: registerSchema })
      
      const user = await User.create({
        ...payload,
        status: 'pending'
      })

      return response.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status
        }
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Registration failed',
        errors: error.messages.erros || error.message.errors
      })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.required()]),
    })

    try {
      const { email, password } = await request.validate({ schema: loginSchema })
      
      const user = await User.findBy('email', email)
      
      if (!user) {
        return response.status(401).json({
          message: 'Invalid credentials'
        })
      }

      if (!(await Hash.verify(user.password, password))) {
        return response.status(401).json({
          message: 'Invalid credentials'
        })
      }

      if (user.status !== 'active') {
        return response.status(401).json({
          message: 'Account is not active. Please contact administrator.'
        })
      }

      const token = await auth.use('api').generate(user)

      return response.json({
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token: token.token
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Login failed',
        errors: error.messages.errors || error.message.errors
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return response.json({
        message: 'Logout successful'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Logout failed'
      })
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user!
      return response.json({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          location: user.location,
          licenseNumber: user.licenseNumber,
          businessName: user.businessName
        }
      })
    } catch (error) {
      return response.status(401).json({
        message: 'Unauthorized'
      })
    }
  }
}