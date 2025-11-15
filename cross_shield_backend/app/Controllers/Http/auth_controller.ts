import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Role from '#models/role' // Import Role model
import HealthPractitioner from '#models/health_practitioner'
import { createUserValidator, loginValidator } from '#validators/auth'
import { Exception } from '@adonisjs/core/exceptions'
import { userRegistered } from '../../Mail/email.js'
import mail from '@adonisjs/mail/services/main'
export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const payload = await request.validateUsing(createUserValidator)

      const {
        role: roleName,
        specialization,
        licenseNumber,
        location,
        ...userPayload
      } = payload as any

      const role = await Role.query({ client: trx }).where('name', roleName).firstOrFail()

      const user = await User.create(
        {
          ...userPayload,
          location: location ?? null,
          roleId: role.id,
          status: 'pending',
        },
        { client: trx }
      )

      if (role.name === 'health_practitioner') {
        await HealthPractitioner.updateOrCreate(
          { userId: user.id },
          {
            specialization: specialization ?? request.input('specialization') ?? null,
            licenseNumber: licenseNumber ?? request.input('licenseNumber') ?? null,
            location: user.location ?? request.input('location') ?? null,
            status: 'pending',
          },
          { client: trx }
        )
      }

      await trx.commit()

      await user.load('role', (r) => r.preload('permissions'))
      await user.load('healthPractitioner')

      const token = await User.accessTokens.create(user)

      const { subject, html, text } = userRegistered({
        userName: user.fullName || 'there',
        appName: 'Cross Shield',
        supportEmail: 'support@crossshieldhc.com',
      })

      try {
        await mail.send((m) => {
          m.to(user.email)
          m.subject(subject)
          m.html(html)
          m.text(text)
        })
      } catch (e) {
        console.error('welcome email failed', e)
      }

      return response.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role?.name,
          status: user.status,
          healthPractitioner: user.healthPractitioner
            ? {
                id: user.healthPractitioner.id,
                specialization: user.healthPractitioner.specialization,
                licenseNumber: user.healthPractitioner.licenseNumber,
                location: user.healthPractitioner.location,
                status: user.healthPractitioner.status,
              }
            : null,
        },
        token: token.value!.release(),
      })
    } catch (error) {
      try {
        await trx.rollback()
      } catch {}
      if (error && 'messages' in error) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: (error as any).messages,
        })
      }
      console.error('Registration error:', error)
      return response.status(500).json({
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      console.log('🔍 LOGIN ATTEMPT STARTED')
      const { email, password } = await request.validateUsing(loginValidator)
      console.log('✅ Input validation passed for:', email)

      // Step 3: Verify credentials
      console.log('🔐 Verifying credentials...')
      const user = await User.verifyCredentials(email, password)

      if (!user) {
        console.log('❌ Credential verification failed for:', email)
        return response.status(401).json({
          message: 'Invalid credentials',
        })
      }

      console.log('✅ Credentials verified successfully for user:', {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
      })

      // Step 4: Check user status
      if (user.status !== 'active') {
        console.log('⚠️ User account is not active:', user.status)
        return response.status(403).json({
          message: 'Account is not active. Please contact administrator.',
        })
      }

      // Step 5: Generate access token
      console.log('🎫 Generating access token...')
      let token
      try {
        token = await User.accessTokens.create(user, [])
        console.log('✅ Access token generated:', token.value?.release())
      } catch (tokenError) {
        console.error('💥 Token creation failed:', tokenError)
        throw new Error('Failed to generate access token')
      }

      // Load user with role and permissions
      await user.load('role', (roleQuery) => {
        roleQuery.preload('permissions')
      })
      if (!user.role) {
        console.log(`⚠️ User ${user.email} has no role assigned`)
      }
      // localStorage.setItem('auth_token', token.value!.release() || '')
      // localStorage.setItem('user_role', user.role.id.toString()) // Convert id to string

      console.log('🎉 LOGIN SUCCESSFUL')
      return response.json({
        message: 'Login successful',
        user: user.serialize(),
        token: token.value!.release() || '',
      })
    } catch (error) {
      console.error('💥 LOGIN ERROR:', {
        type: error.constructor.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      })

      if (error instanceof Exception && 'messages' in error) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      if (error.message && error.message.toLowerCase().includes('credential')) {
        return response.status(401).json({
          message: 'Invalid credentials',
        })
      }

      return response.status(500).json({
        message: 'Login failed',
        error:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Internal server error',
      })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      // Get current user and token
      const user = auth.user!
      const token = user.currentAccessToken

      // Delete the current access token
      await User.accessTokens.delete(user, token.identifier)

      return response.json({
        message: 'Logout successful',
      })
    } catch (error) {
      console.error('Logout error:', error)
      return response.status(500).json({
        message: 'Logout failed',
        error:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Internal server error',
      })
    }
  }

  public async me({ auth, response }: HttpContext) {
    try {
      const user = auth.user

      if (!user) {
        return response.status(401).json({
          message: 'Unauthorized',
          error: 'No authenticated user found',
        })
      }

      await user.load('role') // Optional, if needed

      return response.ok({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role, // make sure it's loaded
          status: user.status,
          location: user.location,
          licenseNumber: user.licenseNumber,
          businessName: user.businessName,
        },
      })
    } catch (error) {
      console.error('Me endpoint error:', error)
      return response.status(500).json({
        message: 'Internal server error',
        error: error.message,
      })
    }
  }
  public async forgotPassword({ request, response }: HttpContext) {
    try {
      const email = request.input('email')
      // Logic to handle password reset (e.g., send reset email)
      return response.json({ message: `Password reset link sent to ${email}` })
    } catch (error) {
      console.error('Forgot Password error:', error)
      return response.status(500).json({
        message: 'Internal server error',
        error: error.message,
      })
    }
  }
  public async resetPassword({ request, response }: HttpContext) {
    try {
      request.only(['token', 'newPassword'])
      // Logic to handle password reset using the token
      return response.json({ message: 'Password has been reset successfully' })
    } catch (error) {
      console.error('Reset Password error:', error)
      return response.status(500).json({
        message: 'Internal server error',
        error: error.message,
      })
    }
  }
  public async changePassword({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])

      // Verify current password
      if (!(await User.verifyCredentials(user.email, currentPassword))) {
        return response.status(401).json({ message: 'Current password is incorrect' })
      }

      // Update to new password
      user.password = newPassword
      await user.save()

      return response.json({ message: 'Password changed successfully' })
    } catch (error) {
      console.error('Change Password error:', error)
      return response.status(500).json({
        message: 'Internal server error',
        error: error.message,
      })
    }
  }
}
