// // app/middleware/CheckPermission.ts
// import { HttpContext } from '@adonisjs/core/http'
// import { NextFn } from '@adonisjs/core/types/http'

// export default class CheckPermission {
//   async handle({ auth, response }: HttpContext, next: NextFn, guards: string[]) {
//     try {
//       // Authenticate user
//       const user = await auth.authenticate()

//       // Load user's role and permissions
//       await user.load('role.permissions')

//       // Check if user has a role
//       if (!user.role) {
//         return response.status(403).json({
//           message: 'No role assigned to user',
//         })
//       }

//       // Check if user is active
//       if (user.status !== 'active') {
//         return response.status(403).json({
//           message: 'User account is not active',
//         })
//       }

//       // Get user's permissions
//       const userPermissions = user.role.permissions
//         .filter((permission: { isActive: boolean }) => permission.isActive)
//         .map((permission: { name: string }) => permission.name)

//       // Check if user has at least one of the required permissions
//       const hasPermission = guards.some((requiredPermission) =>
//         userPermissions.includes(requiredPermission)
//       )

//       if (!hasPermission) {
//         return response.status(403).json({
//           message: 'Insufficient permissions',
//           required: guards,
//           userPermissions: userPermissions,
//         })
//       }

//       // Store user permissions in context for controller use
//       auth.user!.getPermissions = () => userPermissions

//       await next()
//     } catch (error) {
//       return response.status(401).json({
//         message: 'Authentication required',
//       })
//     }
//   }
// }

// // app/middleware/CheckPermission.ts
// import { HttpContext } from '@adonisjs/core/http'
// import { NextFn } from '@adonisjs/core/types/http'

// export function CheckPermission(guards: string[]) {
//   return async function ({ auth, response }: HttpContext, next: NextFn) {
//     try {
//       const user = await auth.authenticate()
//       await user.load('role.permissions')

//       if (!user.role) {
//         return response.status(403).json({ message: 'No role assigned to user' })
//       }

//       if (user.status !== 'active') {
//         return response.status(403).json({ message: 'User account is not active' })
//       }

//       const userPermissions = user.role.permissions
//         .filter((permission: { isActive: boolean }) => permission.isActive)
//         .map((permission: { name: string }) => permission.name)

//       const hasPermission = guards.some((requiredPermission) =>
//         userPermissions.includes(requiredPermission)
//       )

//       if (!hasPermission) {
//         return response.status(403).json({
//           message: 'Insufficient permissions',
//           required: guards,
//           userPermissions,
//         })
//       }

//       auth.user!.getPermissions = () => userPermissions

//       await next()
//     } catch {
//       return response.status(401).json({ message: 'Authentication required' })
//     }
//   }
// }

// app/middleware/CheckPermission.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckPermission {
  /**
   * Handle method runs before the request reaches the controller.
   * `guards` contains the permissions to check for.
   */
  public async handle({ auth, response, request }: HttpContext, next: NextFn, guards: string[]) {
    try {
      // Authenticate user
      const user = await auth.authenticate()

      // Load user's role and permissions
      await user.load('role', (roleQuery) => {
        roleQuery.preload('permissions')
      })
      console.log('Request headers:', request.headers())
      console.log('User from auth.authenticate():', user)

      // Check if user has a role
      if (!user.role) {
        return response.status(403).json({
          message: 'No role assigned to user',
        })
      }

      // Check if user is active
      if (user.status !== 'active') {
        return response.status(403).json({
          message: 'User account is not active',
        })
      }

      // Get user permissions
      const userPermissions = user.role.permissions
        .filter((permission) => permission.isActive)
        .map((permission) => permission.name)

      // Check if user has any of the required permissions
      const hasPermission = guards.some((required) => userPermissions.includes(required))

      if (!hasPermission) {
        return response.status(403).json({
          message: 'Insufficient permissions',
          required: guards,
          userPermissions,
        })
      }

      // Optionally attach permissions for controller use
      auth.user!.getPermissions = async () => userPermissions
      if (user.role.name === 'super_admin') {
        await next()
      }
    } catch (error) {
      return response.status(401).json({
        message: 'Authentication required',
        error: error.message || 'An error occurred during authentication',
      })
    }
  }
}
