// // app/controllers/http/SuperAdminController.ts
// import { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
// import Role from '#models/role'
// // import Permission from '#models/permission'
// import Database from '@adonisjs/lucid/services/db'

// export default class SuperAdminController {
//   /**
//    * VIEW PENDING REGISTRATIONS
//    */
//   async viewPendingRegistrations({ response }: HttpContext) {
//     try {
//       const pendingUsers = await User.query()
//         .where('status', 'pending')
//         .preload('role')
//         .orderBy('created_at', 'desc')

//       return response.json({
//         success: true,
//         data: pendingUsers,
//         count: pendingUsers.length,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error fetching pending registrations',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * APPROVE OR REJECT REGISTRATION
//    */
//   async handleUser({ params, request, response }: HttpContext) {
//     try {
//       const userId = params.id
//       const { action } = request.only(['action'])

//       const user = await User.findOrFail(userId)

//       switch (action) {
//         case 'approve':
//           user.status = 'active'
//           break

//         case 'reject':
//           user.status = 'rejected'
//           // if (reason) {
//           //   user.rejection_reason = reason
//           // }
//           break

//         case 'suspend':
//           user.status = 'suspended'
//           // if (reason) {
//           //   user.suspension_reason = reason
//           // }
//           break

//         case 'activate':
//           user.status = 'active'
//           // user.suspension_reason = null
//           // user.rejection_reason = null
//           break

//         default:
//           return response.status(400).json({
//             message: 'Invalid action. Use: approve, reject, suspend, or activate',
//           })
//       }
//       await user.save()

//       return response.json({
//         message: `User ${action}d successfully`,
//         user: user,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         message: `Failed to handle user action`,
//         error: error.message,
//       })
//     }
//   }
//   // async handleRegistration({ request, response, params }: HttpContext) {
//   //   try {
//   //     const { action, roleId } = request.only(['action', 'roleId'])
//   //     const user = await User.findOrFail(params.id)

//   //     if (!['approve', 'reject'].includes(action)) {
//   //       return response.status(400).json({
//   //         success: false,
//   //         message: 'Invalid action. Use "approve" or "reject"',
//   //       })
//   //     }

//   //     if (action === 'approve') {
//   //       user.status = 'active'
//   //       if (roleId) {
//   //         user.roleId = roleId
//   //       }
//   //     } else {
//   //       user.status = 'rejected'
//   //     }

//   //     await user.save()

//   //     return response.json({
//   //       success: true,
//   //       message: `Registration ${action}d successfully`,
//   //       data: user,
//   //     })
//   //   } catch (error) {
//   //     return response.status(500).json({
//   //       success: false,
//   //       message: 'Error handling registration',
//   //       error: error.message,
//   //     })
//   //   }
//   // }

//   /**
//    * VIEW ALL USERS WITH ROLES
//    */
//   // async viewUsers({ request, response }: HttpContext) {
//   //   try {
//   //     const page = request.input('page', 1)
//   //     const limit = request.input('limit', 10)
//   //     const status = request.input('status')
//   //     const role = request.input('role')

//   //     const query = User.query().preload('role')

//   //     if (status) {
//   //       query.where('status', status)
//   //     }

//   //     if (role) {
//   //       query.whereHas('role', (roleQuery: any) => {
//   //         roleQuery.where('name', role)
//   //       })
//   //     }

//   //     const users = await query.paginate(page, limit)

//   //     return response.json({
//   //       success: true,
//   //       data: users,
//   //     })
//   //   } catch (error) {
//   //     return response.status(500).json({
//   //       success: false,
//   //       message: 'Error fetching users',
//   //       error: error.message,
//   //     })
//   //   }
//   // }
//   public async viewUsers({ response }: HttpContext) {
//     try {
//       // Replace with actual database query, e.g., User.all()
//       const users = [{ id: 1, name: 'Test User' }]
//       return response.json({ users })
//     } catch (error) {
//       console.error('Error in viewUsers:', error)
//       return response.status(500).json({ error: 'Internal Server Error' })
//     }
//   }
// }

//   /**
//    * REVOKE USER ACCESS (SUSPEND)
//    */

//   async revokeUserAccess({ params, response }: HttpContext) {
//     // try {
//     //   const user = await User.findOrFail(params.id)

//     //   if (user.status === 'suspended') {
//     //     return response.status(400).json({
//     //       success: false,
//     //       message: 'User is already suspended',
//     //     })
//     //   }

//     //   user.status = 'suspended'
//     //   await user.save()

//     //   return response.json({
//     //     success: true,
//     //     message: 'User access revoked successfully',
//     //     data: user,
//     //   })
//     // } catch (error) {
//     //   return response.status(500).json({
//     //     success: false,
//     //     message: 'Error revoking user access',
//     //     error: error.message,
//     //   })
//     // }
//     try {
//       const userId = params.id

//       const user = await User.findOrFail(userId)
//       if (user.status === 'suspended') {
//         return response.status(400).json({
//           success: false,
//           message: 'User is suspended',
//         })
//       }

//       user.status = 'suspended'
//       await user.save()

//       return response.json({
//         message: 'User suspended successfully',
//         user: user,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Failed to suspend user',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * RESTORE USER ACCESS
//    */
//   async restoreUserAccess({ params, response }: HttpContext) {
//     try {
//       const user = await User.findOrFail(params.id)
//       user.status = 'active'
//       await user.save()

//       return response.json({
//         success: true,
//         message: 'User access restored successfully',
//         data: user,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error restoring user access',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * DELETE USER
//    */
//   async deleteUser({ params, response }: HttpContext) {
//     try {
//       const user = await User.findOrFail(params.id)

//       // Prevent deleting super admin
//       await user.load('role')
//       if (user.role && user.role.name === 'super_admin') {
//         return response.status(403).json({
//           success: false,
//           message: 'Cannot delete super admin user',
//         })
//       }

//       await user.delete()

//       return response.json({
//         success: true,
//         message: 'User deleted successfully',
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error deleting user',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * VIEW PENDING ADVERTS
//    */
//   async viewPendingAdverts({ response }: HttpContext) {
//     try {
//       // Assuming you have an Advert model
//       // const pendingAdverts = await Advert.query()
//       //   .where('status', 'pending')
//       //   .preload('user')
//       //   .orderBy('created_at', 'desc')

//       // For now, return placeholder
//       return response.json({
//         success: true,
//         message: 'Implement Advert model to use this endpoint',
//         data: [],
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error fetching pending adverts',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * APPROVE OR REJECT ADVERT
//    */
//   async handleAdvert({ request, response, params }: HttpContext) {
//     try {
//       const { action, reason } = request.only(['action', 'reason'])

//       if (!['approve', 'reject'].includes(action)) {
//         return response.status(400).json({
//           success: false,
//           message: 'Invalid action. Use "approve" or "reject"',
//         })
//       }

//       // Assuming you have an Advert model
//       // const advert = await Advert.findOrFail(params.id)
//       // advert.status = action === 'approve' ? 'approved' : 'rejected'
//       // if (reason) advert.reviewReason = reason
//       // await advert.save()

//       return response.json({
//         success: true,
//         message: `Advert ${action}d successfully`,
//         note: 'Implement Advert model to fully use this endpoint',
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error handling advert',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * VIEW PENDING SUPPLIERS
//    */
//   async viewPendingSuppliers({ response }: HttpContext) {
//     try {
//       const pendingSuppliers = await User.query()
//         .whereHas('role', (roleQuery) => {
//           roleQuery.where('name', 'supplier')
//         })
//         .where('status', 'pending')
//         .preload('role')
//         .orderBy('created_at', 'desc')

//       return response.json({
//         success: true,
//         data: pendingSuppliers,
//         count: pendingSuppliers.length,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error fetching pending suppliers',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * APPROVE OR REJECT SUPPLIER
//    */
//   async handleSupplier({ request, response, params }: HttpContext) {
//     try {
//       const { action } = request.only(['action'])
//       const supplier = await User.findOrFail(params.id)

//       if (!['approve', 'reject'].includes(action)) {
//         return response.status(400).json({
//           success: false,
//           message: 'Invalid action. Use "approve" or "reject"',
//         })
//       }

//       supplier.status = action === 'approve' ? 'active' : 'rejected' // No change needed here
//       await supplier.save()

//       return response.json({
//         success: true,
//         message: `Supplier ${action}d successfully`,
//         data: supplier,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error handling supplier',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * VIEW ALL ROLES AND PERMISSIONS
//    */
//   async viewRoles({ response }: HttpContext) {
//     try {
//       const roles = await Role.query().preload('permissions').withCount('users')

//       return response.json({
//         success: true,
//         data: roles,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error fetching roles',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * ASSIGN ROLE TO USER
//    */
//   async assignRole({ request, response, params }: HttpContext) {
//     try {
//       const { roleId } = request.only(['roleId'])
//       const user = await User.findOrFail(params.id)
//       const role = await Role.findOrFail(roleId)

//       user.roleId = role.id
//       await user.save()

//       await user.load('role')

//       return response.json({
//         success: true,
//         message: 'Role assigned successfully',
//         data: user,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error assigning role',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * VIEW SYSTEM STATISTICS
//    */
//   async viewStats({ response }: HttpContext) {
//     try {
//       const stats = await Database.rawQuery(`
//         SELECT
//           'total_users' as metric, COUNT(*) as count FROM users
//         UNION ALL
//         SELECT
//           'active_users' as metric, COUNT(*) as count FROM users WHERE status = 'active'
//         UNION ALL
//         SELECT
//           'pending_users' as metric, COUNT(*) as count FROM users WHERE status = 'pending'
//         UNION ALL
//         SELECT
//           'suspended_users' as metric, COUNT(*) as count FROM users WHERE status = 'suspended'
//       `)

//       const formattedStats = stats.reduce((acc: any, stat: any) => {
//         acc[stat.metric] = Number.parseInt(stat.count)
//         return acc
//       }, {})

//       return response.json({
//         success: true,
//         data: formattedStats,
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error fetching statistics',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * RESET USER PASSWORD
//    */
//   async resetUserPassword({ request, response, params }: HttpContext) {
//     try {
//       const { newPassword } = request.only(['newPassword'])
//       const user = await User.findOrFail(params.id)

//       if (!newPassword || newPassword.length < 6) {
//         return response.status(400).json({
//           success: false,
//           message: 'Password must be at least 6 characters long',
//         })
//       }

//       user.password = newPassword
//       await user.save()

//       return response.json({
//         success: true,
//         message: 'Password reset successfully',
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error resetting password',
//         error: error.message,
//       })
//     }
//   }

//   /**
//    * VIEW USER ACTIVITY (placeholder for future implementation)
//    */
//   async viewUserActivity({ params, response }: HttpContext) {
//     try {
//       const user = await User.findOrFail(params.id)

//       // This would require an activity log system
//       return response.json({
//         success: true,
//         message: 'User activity tracking not yet implemented',
//         data: {
//           userId: user.id,
//           lastLogin: user.updatedAt,
//           note: 'Implement activity logging system for detailed tracking',
//         },
//       })
//     } catch (error) {
//       return response.status(500).json({
//         success: false,
//         message: 'Error fetching user activity',
//         error: error.message,
//       })
//     }
//   }
// }

import { HttpContext } from '@adonisjs/core/http'
import { validator, schema, rules } from '@adonisjs/validator'
import User from '#models/user'
import Role from '#models/role'
import Database from '@adonisjs/lucid/services/db'
import { Hash } from '@adonisjs/core/hash'

/**
 * Utility function to standardize API responses
 */
const sendResponse = (
  response: HttpContext['response'],
  data: any,
  message: string,
  status = 200
) => {
  return response.status(status).json({ success: true, message, data })
}

const sendError = (
  response: HttpContext['response'],
  message: string,
  error: any,
  status = 500
) => {
  return response.status(status).json({ success: false, message, error: error?.message || error })
}

export default class SuperAdminController {
  /**
   * View pending user registrations with pagination
   */
  async viewPendingRegistrations({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const pendingUsers = await User.query()
        .where('status', 'pending')
        .preload('role')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return sendResponse(
        response,
        {
          users: pendingUsers,
          count: pendingUsers.total,
        },
        'Pending registrations fetched successfully'
      )
    } catch (error) {
      return sendError(response, 'Error fetching pending registrations', error)
    }
  }

  /**
   * Manage user status (approve, reject, suspend, activate)
   */
  async manageUserStatus({ params, request, response }: HttpContext) {
    const validationSchema = schema.create({
      action: schema.enum(['approve', 'reject', 'suspend', 'activate'] as const),
    })

    try {
      const payload = await validator.validate({
        schema: validationSchema,
        data: request.only(['action']),
      })

      const user = await User.findOrFail(params.id)

      switch (payload.action) {
        case 'approve':
        case 'activate':
          user.status = 'active'
          break
        case 'reject':
          user.status = 'rejected'
          break
        case 'suspend':
          user.status = 'suspended'
          break
      }

      await user.save()

      return sendResponse(response, user, `User ${payload.action}d successfully`)
    } catch (error) {
      return sendError(response, 'Failed to manage user status', error, error.status || 500)
    }
  }

  /**
   * Handle user registration (approve or reject with role assignment)
   */
  async handleRegistration({ request, response, params }: HttpContext) {
    const validationSchema = schema.create({
      action: schema.enum(['approve', 'reject'] as const),
      roleId: schema.number.optional(),
    })

    try {
      const payload = await validator.validate({
        schema: validationSchema,
        data: request.only(['action', 'roleId']),
      })

      return await Database.transaction(async (trx) => {
        const user = await User.findOrFail(params.id, { client: trx })

        if (payload.action === 'approve') {
          user.status = 'active'
          if (payload.roleId) {
            const role = await Role.findOrFail(payload.roleId, { client: trx })
            user.roleId = role.id
          }
        } else {
          user.status = 'rejected'
        }

        await user.save()

        return sendResponse(response, user, `Registration ${payload.action}d successfully`)
      })
    } catch (error) {
      return sendError(response, 'Error handling registration', error, error.status || 500)
    }
  }

  /**
   * View all users with optional filtering and pagination
   */
  async viewUsers({ request, response, auth }: HttpContext) {
    try {
      const currentUser = auth.user

      if (!currentUser) {
        return response.unauthorized({ success: false, message: 'Unauthorized' })
      }

      await currentUser.load('role')

      if (currentUser.role?.name !== 'super_admin') {
        return response.unauthorized({
          success: false,
          message: 'Only super admins can access this route',
        })
      }

      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      const role = request.input('role')

      const query = User.query().preload('role')

      if (status) {
        query.where('status', status)
      }

      if (role) {
        query.whereHas('role', (roleQuery) => {
          roleQuery.where('name', role)
        })
      }

      const users = await query.paginate(page, limit)

      return sendResponse(response, users, 'Users fetched successfully')
    } catch (error) {
      console.log(error)
      return sendError(response, 'Error fetching users', error)
    }
  }

  /**
   * Suspend user access
   */
  async revokeUserAccess({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      if (user.status === 'suspended') {
        return sendError(response, 'User is already suspended', null, 400)
      }

      user.status = 'suspended'
      await user.save()

      return sendResponse(response, user, 'User access revoked successfully')
    } catch (error) {
      return sendError(response, 'Error revoking user access', error)
    }
  }

  /**
   * Restore user access
   */
  async restoreUserAccess({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      if (user.status === 'active') {
        return sendError(response, 'User is already active', null, 400)
      }

      user.status = 'active'
      await user.save()

      return sendResponse(response, user, 'User access restored successfully')
    } catch (error) {
      return sendError(response, 'Error restoring user access', error)
    }
  }

  /**
   * Delete a user (except super admins)
   */
  async deleteUser({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.load('role')

      if (user.role?.name === 'super_admin') {
        return sendError(response, 'Cannot delete super admin user', null, 403)
      }

      await user.delete()

      return sendResponse(response, null, 'User deleted successfully')
    } catch (error) {
      return sendError(response, 'Error deleting user', error)
    }
  }

  /**
   * View pending adverts (placeholder, requires Advert model)
   */
  async viewPendingAdverts({ response }: HttpContext) {
    try {
      // TODO: Implement Advert model
      // const pendingAdverts = await Advert.query()
      //   .where('status', 'pending')
      //   .preload('user')
      //   .orderBy('created_at', 'desc')
      // return sendResponse(response, pendingAdverts, 'Pending adverts fetched successfully')

      return sendResponse(response, [], 'Advert model not implemented')
    } catch (error) {
      return sendError(response, 'Error fetching pending adverts', error)
    }
  }

  /**
   * Approve or reject an advert
   */
  async handleAdvert({ request, response, params }: HttpContext) {
    const validationSchema = schema.create({
      action: schema.enum(['approve', 'reject'] as const),
    })

    try {
      const payload = await validator.validate({
        schema: validationSchema,
        data: request.only(['action']),
      })

      // TODO: Implement Advert model
      // const advert = await Advert.findOrFail(params.id)
      // advert.status = payload.action === 'approve' ? 'approved' : 'rejected'
      // await advert.save()
      // return sendResponse(response, advert, `Advert ${payload.action}d successfully`)

      return sendResponse(response, null, `Advert ${payload.action}d successfully (placeholder)`)
    } catch (error) {
      return sendError(response, 'Error handling advert', error, error.status || 500)
    }
  }

  /**
   * View pending suppliers with pagination
   */
  async viewPendingSuppliers({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const pendingSuppliers = await User.query()
        .whereHas('role', (roleQuery) => {
          roleQuery.where('name', 'supplier')
        })
        .where('status', 'pending')
        .preload('role')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return sendResponse(
        response,
        {
          suppliers: pendingSuppliers,
          count: pendingSuppliers.total,
        },
        'Pending suppliers fetched successfully'
      )
    } catch (error) {
      return sendError(response, 'Error fetching pending suppliers', error)
    }
  }

  /**
   * Approve or reject a supplier
   */
  async handleSupplier({ request, response, params }: HttpContext) {
    const validationSchema = schema.create({
      action: schema.enum(['approve', 'reject'] as const),
    })

    try {
      const payload = await validator.validate({
        schema: validationSchema,
        data: request.only(['action']),
      })

      const supplier = await User.findOrFail(params.id)
      await supplier.load('role')

      if (supplier.role?.name !== 'supplier') {
        return sendError(response, 'User is not a supplier', null, 400)
      }

      supplier.status = payload.action === 'approve' ? 'active' : 'rejected'
      await supplier.save()

      return sendResponse(response, supplier, `Supplier ${payload.action}d successfully`)
    } catch (error) {
      return sendError(response, 'Error handling supplier', error, error.status || 500)
    }
  }

  /**
   * View all roles and their permissions
   */
  async viewRoles({ response }: HttpContext) {
    try {
      const roles = await Role.query().preload('permissions').withCount('users')

      return sendResponse(response, roles, 'Roles fetched successfully')
    } catch (error) {
      return sendError(response, 'Error fetching roles', error)
    }
  }

  /**
   * Assign a role to a user
   */
  async assignRole({ request, response, params }: HttpContext) {
    const validationSchema = schema.create({
      roleId: schema.number(),
    })

    try {
      const payload = await validator.validate({
        schema: validationSchema,
        data: request.only(['roleId']),
      })

      return await Database.transaction(async (trx) => {
        const user = await User.findOrFail(params.id, { client: trx })
        const role = await Role.findOrFail(payload.roleId, { client: trx })

        user.roleId = role.id
        await user.save()

        await user.load('role')

        return sendResponse(response, user, 'Role assigned successfully')
      })
    } catch (error) {
      return sendError(response, 'Error assigning role', error, error.status || 500)
    }
  }

  /**
   * View system statistics
   */
  async viewStats({ response }: HttpContext) {
    try {
      const [stats] = await Database.rawQuery(`
        SELECT
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
          (SELECT COUNT(*) FROM users WHERE status = 'pending') as pending_users,
          (SELECT COUNT(*) FROM users WHERE status = 'suspended') as suspended_users
      `)

      return sendResponse(response, stats, 'Statistics fetched successfully')
    } catch (error) {
      return sendError(response, 'Error fetching statistics', error)
    }
  }

  /**
   * Reset a user's password
   */
  async resetUserPassword({ request, response, params }: HttpContext) {
    const validationSchema = schema.create({
      newPassword: schema.string({}, [rules.minLength(6), rules.maxLength(100)]),
    })

    try {
      const payload = await validator.validate({
        schema: validationSchema,
        data: request.only(['newPassword']),
      })

      const user = await User.findOrFail(params.id)
      user.password = await Hash.make(payload.newPassword) // Use configured hasher
      await user.save()

      return sendResponse(response, null, 'Password reset successfully')
    } catch (error) {
      return sendError(response, 'Error resetting password', error, error.status || 500)
    }
  }

  /**
   * View user activity (placeholder)
   */
  async viewUserActivity({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      // TODO: Implement activity logging system
      return sendResponse(
        response,
        {
          userId: user.id,
          lastLogin: user.updatedAt,
          note: 'Activity logging system not yet implemented',
        },
        'User activity fetched successfully'
      )
    } catch (error) {
      return sendError(response, 'Error fetching user activity', error)
    }
  }
}
