// import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
// import { createUserValidator, loginValidator } from '#validators/auth'
// import { Exception } from '@adonisjs/core/exceptions'

// export default class AuthController {
//   public async register({ request, response }: HttpContext) {
//     try {
//       const payload = await request.validateUsing(createUserValidator)

//       const user = await User.create({
//         ...payload,
//         status: 'pending' as const,
//       })

//       return response.status(201).json({
//         message: 'User registered successfully',
//         user: {
//           id: user.id, // Use id for User
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//         },
//       })
//     } catch (error) {
//       // Better error typing
//       if (error instanceof Exception && 'messages' in error) {
//         return response.status(400).json({
//           message: 'Registration failed',
//           errors: error.messages,
//         })
//       }

//       return response.status(400).json({
//         message: 'Registration failed',
//         errors: error instanceof Error ? error.message : 'Unknown error',
//       })
//     }
//   }

//   public async login({ request, response }: HttpContext) {
//     try {
//       console.log('=== LOGIN REQUEST DEBUG ===')
//       console.log('Raw body:', request.body())
//       console.log('Content-Type:', request.header('content-type'))
//       console.log('All headers:', request.headers())
//       const { email, password } = await request.validateUsing(loginValidator)

//       console.log('=== LOGIN DEBUG ===')
//       console.log('Attempting login for:', email)
//       console.log('Password provided:', password ? 'Yes' : 'No')

//       // Check if user exists first
//       const userExists = await User.findBy('email', email)
//       console.log('User found in database:', userExists ? 'Yes' : 'No')

//       if (userExists) {
//         console.log('User details:', {
//           id: userExists.id,
//           email: userExists.email,
//           status: userExists.status,
//           fullName: userExists.fullName,
//         })
//       }
//       // const user = (await User.verifyCredentials(email, password)) as User

//       // console.log('Credentials verified successfully')
//       // if ((user as User).status !== 'active') {
//       //   console.log('User status check failed:', user.status)
//       //   return response.status(401).json({
//       //     message: 'Account is not active. Please contact administrator.',
//       //   })
//       // }
//       console.log('=== PASSWORD VERIFICATION DEBUG ===')

//   // Get the user first
//   const user = await User.query().where('email', email).first()
//   if (!user) {
//     console.log('User not found for verification')
//     return response.status(400).json({ message: 'Login failed', errors: 'Invalid user credentials' })
//   }

//   console.log('User found for verification:', {
//     id: user.id,
//     email: user.email,
//     passwordLength: user.password?.length,
//     passwordStart: user.password?.substring(0, 20)
//   })

//   console.log('Attempting to verify password:', password)

//   // Try the verification
//   const verifiedUser = await User.verifyCredentials(email, password)

//   console.log('✅ Verification successful!')
//   // ... rest of your login logic

// } catch (error) {
//   console.log('❌ Verification failed:', error.message)
//   console.log('Error code:', error.code)

//   // Let's also try manual hash verification
//   const user = await User.query().where('email', email).first()
//   if (user) {
//     try {
//       const hashService = hash.use('scrypt')
//       const isValid = await hashService.verify(user.password, password)
//       console.log('Manual hash verification result:', isValid)
//     } catch (hashError) {
//       console.log('Manual hash verification error:', hashError.message)
//     }
//   }

//   throw error
// }
//       const token = await User.accessTokens.create(user)

//       return response.json({
//         message: 'Login successful',
//         user: {
//           id: user.id, // Use $id for LucidRow
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//         },
//         token: token.value?.release() || '', // Safer token handling
//       })
//     } catch (error) {
//       console.error('Login error details:', error)
//       console.error('=== LOGIN ERROR ===')
//       console.error('Error type:', error.constructor.name)
//       console.error('Error message:', error.message)
//       // This will help us see if it's a credentials error or something else
//       if (error.message.includes('credentials')) {
//         console.error('Credentials verification failed')
//       }
//       if (error instanceof Exception && 'messages' in error) {
//         console.error('Validation errors:', error.messages)
//         return response.status(400).json({
//           message: 'Login failed',
//           errors: error.messages,
//         })
//       }

//       return response.status(400).json({
//         message: 'Login failed',
//         errors: error instanceof Error ? error.message : 'Unknown error',
//       })
//     }
//   }

//   public async logout({ response }: HttpContext) {
//     try {
//       return response.json({
//         message: 'Logout successful',
//       })
//     } catch (error) {
//       return response.status(500).json({
//         message: 'Logout failed',
//       })
//     }
//   }

//   public async me({ response }: HttpContext) {
//     try {
//       const user = (response as any).locals.user

//       // Type guard instead of unsafe casting
//       if (!user || !(user instanceof User)) {
//         return response.status(401).json({
//           message: 'Unauthorized - User not found',
//         })
//       }

//       return response.json({
//         user: {
//           id: user.id,
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//           location: user.location,
//           licenseNumber: user.licenseNumber,
//           businessName: user.businessName,
//         },
//       })
//     } catch (error) {
//       return response.status(401).json({
//         message: 'Unauthorized',
//       })
//     }
//   }
// }

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, loginValidator } from '#validators/auth'
import { Exception } from '@adonisjs/core/exceptions'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createUserValidator)

      const user = await User.create({
        ...payload,
        status: 'pending' as const,
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
      if (error instanceof Exception && 'messages' in error) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: error.messages,
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

      // Step 1: Validate input
      const { email, password } = await request.validateUsing(loginValidator)
      console.log('✅ Input validation passed for:', email)

      // Step 2: Use the working User.verifyCredentials method
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

      // Step 3: Check user status
      if (user.status !== 'active') {
        console.log('⚠️ User account is not active:', user.status)
        return response.status(403).json({
          message: 'Account is not active. Please contact administrator.',
        })
      }

      // Step 4: Generate access token
      console.log('🎫 Generating access token...')
      const token = await User.accessTokens.create(user)
      console.log('✅ Access token generated successfully')

      console.log('🎉 LOGIN SUCCESSFUL')
      return response.json({
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token: token.value?.release() || '',
      })
    } catch (error) {
      console.error('💥 LOGIN ERROR:', {
        type: error.constructor.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      })

      // Handle validation errors
      if (error instanceof Exception && 'messages' in error) {
        return response.status(422).json({
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      // Handle credential errors (thrown by User.verifyCredentials)
      if (error.message && error.message.toLowerCase().includes('credential')) {
        return response.status(401).json({
          message: 'Invalid credentials',
        })
      }

      // Handle other errors
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
          businessName: user.businessName,
        },
      })
    } catch (error) {
      console.error('Me endpoint error:', error)
      return response.status(401).json({
        message: 'Unauthorized',
        error: 'Authentication required',
      })
    }
  }
}
