// import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
// import { updateUserValidator } from '#validators/user'

// export default class UsersController {
//   public async index({ request, response, auth }: HttpContext) {
//     try {
//       const currentUser = auth.user
//       if (!currentUser) return response.status(401).json({ message: 'Unauthorized' })

//       await currentUser.load('role')

//       if (currentUser.role.name !== 'super_admin') {
//         return response.status(403).json({ message: 'Only super admin can view all users' })
//       }

//       const roleFilter = request.input('role')

//       const query = User.query()
//         .preload('role')
//         .select(
//           'id',
//           'full_name',
//           'email',
//           'phone',
//           'role_id', // use role_id in users table
//           'status',
//           'location',
//           'license_number',
//           'business_name',
//           'created_at'
//         )
//         .orderBy('created_at', 'desc')

//       if (roleFilter) {
//         query.whereHas('role', (roleQuery) => {
//           roleQuery.where('name', roleFilter)
//         })
//       }

//       const users = await query

//       return response.json({ users })
//     } catch (error) {
//       return response.status(500).json({
//         message: 'Failed to fetch users',
//         error: error.message,
//       })
//     }
//   }

//   public async show({ params, response, auth }: HttpContext) {
//     try {
//       const currentUser = auth.user
//       if (!currentUser) return response.status(401).json({ message: 'Unauthorized' })

//       await currentUser.load('role')

//       const user = await User.query()
//         .preload('role')
//         .select(
//           'id',
//           'full_name',
//           'email',
//           'phone',
//           'role_id',
//           'status',
//           'location',
//           'license_number',
//           'business_name',
//           'created_at'
//         )
//         .where('id', params.id)
//         .firstOrFail()

//       if (currentUser.role.name !== 'super_admin' && currentUser.id !== user.id) {
//         return response.status(403).json({ message: 'Unauthorized to view this user' })
//       }

//       return response.json({ user })
//     } catch {
//       return response.status(404).json({ message: 'User not found' })
//     }
//   }

//   public async update({ params, request, response, auth }: HttpContext) {
//     try {
//       const currentUser = auth.user
//       if (!currentUser) return response.status(401).json({ message: 'Unauthorized' })

//       await currentUser.load('role')

//       const payload = await request.validateUsing(updateUserValidator)
//       const user = await User.findOrFail(params.id)

//       if (currentUser.role.name !== 'super_admin' && currentUser.id !== user.id) {
//         return response.status(403).json({ message: 'Unauthorized to update this user' })
//       }

//       if (payload.status && currentUser.role.name !== 'super_admin') {
//         delete payload.status
//       }

//       user.merge(payload)
//       await user.save()

//       return response.json({
//         message: 'User updated successfully',
//         user: {
//           id: user.id,
//           fullName: user.fullName,
//           email: user.email,
//           phone: user.phone,
//           role: user.role,
//           status: user.status,
//           location: user.location,
//           licenseNumber: user.licenseNumber,
//           businessName: user.businessName,
//         },
//       })
//     } catch (error) {
//       return response.status(400).json({
//         message: 'Failed to update user',
//         errors: error.messages || error.message,
//       })
//     }
//   }

//   public async approve({ params, response, auth }: HttpContext) {
//     try {
//       const currentUser = auth.user
//       if (!currentUser) return response.status(401).json({ message: 'Unauthorized' })

//       await currentUser.load('role')

//       if (currentUser.role.name !== 'super_admin') {
//         return response.status(403).json({ message: 'Only super admin can approve users' })
//       }

//       const user = await User.findOrFail(params.id)
//       user.status = 'active'
//       await user.save()

//       return response.json({
//         message: 'User approved successfully',
//         user: {
//           id: user.id,
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//         },
//       })
//     } catch {
//       return response.status(404).json({ message: 'User not found' })
//     }
//   }

//   public async suspend({ params, response, auth }: HttpContext) {
//     try {
//       const currentUser = auth.user
//       if (!currentUser) return response.status(401).json({ message: 'Unauthorized' })

//       await currentUser.load('role')

//       if (currentUser.role.name !== 'super_admin') {
//         return response.status(403).json({ message: 'Only super admin can suspend users' })
//       }

//       const user = await User.findOrFail(params.id)
//       user.status = 'suspended'
//       await user.save()

//       return response.json({
//         message: 'User suspended successfully',
//         user: {
//           id: user.id,
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//         },
//       })
//     } catch {
//       return response.status(404).json({ message: 'User not found' })
//     }
//   }

//   public async destroy({ params, response, auth }: HttpContext) {
//     try {
//       const currentUser = auth.user
//       if (!currentUser) return response.status(401).json({ message: 'Unauthorized' })

//       await currentUser.load('role')

//       if (currentUser.role.name !== 'super_admin') {
//         return response.status(403).json({ message: 'Only super admin can delete users' })
//       }

//       const user = await User.findOrFail(params.id)
//       await user.delete()

//       return response.json({ message: 'User deleted successfully' })
//     } catch {
//       return response.status(404).json({ message: 'User not found' })
//     }
//   }
// }

import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Role from '#models/role'
import HealthPractitioner from '#models/health_practitioner'
import { updateUserValidator } from '#validators/user'
import { createHealthPractitionerValidator } from '#validators/health_practitioner'

export default class UsersController {
  // public async index({ request, response, auth }: HttpContext) {
  //   try {
  //     const me = auth.user
  //     if (!me) return response.status(401).json({ message: 'Unauthorized' })
  //     await me.load('role')
  //     if (me.role.name !== 'super_admin') {
  //       return response.status(403).json({ message: 'Only super admin can view all users' })
  //     }

  //     const roleFilter = request.input('role')
  //     const profileStatus = request.input('status') as
  //       | 'active'
  //       | 'inactive'
  //       | 'suspended'
  //       | undefined
  //     const q = request.input('q')

  //     const query = User.query()
  //       .leftJoin('health_practitioners as hp', 'hp.user_id', 'users.id')
  //       .select('users.*')
  //       .select('hp.license_number as hp_license_number')

  //     if (typeof roleFilter === 'string' && roleFilter.length > 0) {
  //       query.whereHas('role', (r) => r.where('name', roleFilter))
  //     }

  //     if (typeof q === 'string' && q.length > 0) {
  //       query.where((b) => {
  //         b.whereILike('full_name', `%${q}%`).orWhereILike('email', `%${q}%`)
  //       })
  //     }

  //     query
  //       .preload('role')
  //       .preload('healthPractitioner', (hp) => {
  //         if (profileStatus) hp.where('status', profileStatus)
  //       })
  //       .preload('supplier', (sp) => {
  //         if (profileStatus) sp.where('status', profileStatus)
  //       })
  //       .orderBy('created_at', 'desc')

  //     const rows = await query

  //     const users = rows.map((u) => {
  //       const roleName = u.role?.name
  //       const hp = u.healthPractitioner
  //       const sp = u.supplier

  //       const status =
  //         roleName === 'health_practitioner'
  //           ? (hp?.status ?? u.status)
  //           : roleName === 'supplier'
  //             ? (sp?.status ?? u.status)
  //             : u.status

  //       const joinedLicenseNumber = (u.$extras as any)?.hp_license_number ?? null

  //       return {
  //         id: u.id,
  //         fullName: u.fullName,
  //         email: u.email,
  //         phone: u.phone,
  //         roleId: u.roleId,
  //         role: roleName,
  //         status,
  //         location: hp?.location ?? sp?.location ?? u.location,
  //         specialization: hp?.specialization ?? sp?.specialization ?? null,
  //         licenseNumber: joinedLicenseNumber ?? hp?.licenseNumber ?? null,
  //         businessName: sp?.businessName ?? u.businessName ?? null,
  //         createdAt: u.createdAt,
  //       }
  //     })

  //     return response.json({ users })
  //   } catch (error) {
  //     return response.status(500).json({ message: 'Failed to fetch users', error: error.message })
  //   }
  // }

  public async index({ request, response, auth }: HttpContext) {
    try {
      const me = auth.user
      if (!me) return response.status(401).json({ message: 'Unauthorized' })
      await me.load('role')
      if (me.role.name !== 'super_admin') {
        return response.status(403).json({ message: 'Only super admin can view all users' })
      }

      const roleFilter = request.input('role') as string | undefined
      const profileStatus = request.input('status') as
        | 'active'
        | 'pending'
        | 'suspended'
        | 'rejected'
      const q = request.input('q') as string | undefined

      const includeRaw =
        request.input('include') || request.input('with') || request.input('preload') || ''
      const includes = String(includeRaw)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const query = User.query()

      if (roleFilter) {
        query.whereHas('role', (r) => r.where('name', roleFilter))
      }

      if (q) {
        query.where((b) => {
          b.whereILike('full_name', `%${q}%`)
            .orWhereILike('email', `%${q}%`)
            .orWhereHas('healthPractitioner', (hp) => {
              hp.whereILike('specialization', `%${q}%`)
                .orWhereILike('license_number', `%${q}%`)
                .orWhereILike('location', `%${q}%`)
            })
            .orWhereHas('supplier', (sp) => {
              sp.whereILike('business_name', `%${q}%`)
                .orWhereILike('specialization', `%${q}%`)
                .orWhereILike('location', `%${q}%`)
            })
        })
      }

      if (profileStatus) {
        query.where((b) => {
          b.whereHas('healthPractitioner', (hp) => hp.where('status', profileStatus))
            .orWhereHas('supplier', (sp) => sp.where('status', profileStatus))
            .orWhere('users.status', profileStatus)
        })
      }

      query.preload('role')

      if (includes.includes('healthPractitioner')) {
        query.preload('healthPractitioner')
      }

      if (includes.includes('supplier')) {
        query.preload('supplier')
      }

      query.orderBy('created_at', 'desc')

      const rows = await query

      const users = rows.map((u) => {
        const roleName = u.role?.name
        const hp = u.healthPractitioner
        const sp = u.supplier

        const status =
          roleName === 'health_practitioner'
            ? (hp?.status ?? u.status)
            : roleName === 'supplier'
              ? (sp?.status ?? u.status)
              : u.status

        return {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          roleId: u.roleId,
          role: roleName,
          status,
          // users.location is canonical. fall back to relation only when missing
          location: u.location ?? hp?.location ?? sp?.location ?? null,
          specialization: hp?.specialization ?? sp?.specialization ?? null,
          licenseNumber: hp?.licenseNumber ?? null,
          businessName: sp?.businessName ?? u.businessName ?? null,
          createdAt: u.createdAt,
        }
      })

      return response.json({ users })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Failed to fetch users', error: (error as any).message })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    const me = auth.user
    if (!me) return response.status(401).json({ message: 'Unauthorized' })
    await me.load('role')
    if (me.role.name !== 'super_admin') {
      return response.status(403).json({ message: 'Only super admin creates users' })
    }

    const payload = await request.validateUsing(createHealthPractitionerValidator)
    const password: string = request.input('password') || 'TempPass123!'

    const trx = await db.transaction()
    try {
      const hpRole = await Role.query({ client: trx }).where('name', 'health_practitioner').first()
      if (!hpRole) {
        await trx.rollback()
        return response.status(422).json({ message: 'health_practitioner role missing' })
      }

      const user = await User.create(
        {
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone || null,
          location: payload.location || null,
          roleId: hpRole.id,
          status: 'active',
          password: password,
        },
        { client: trx }
      )

      const practitioner = await HealthPractitioner.create(
        {
          userId: user.id,
          specialization: payload.specialization || null,
          licenseNumber: payload.licenseNumber || null,
          location: payload.location ?? user.location ?? null,
          status: payload.status || 'active',
          payload: payload.payload ?? null,
        },
        { client: trx }
      )

      await trx.commit()

      await user.load('role')
      await practitioner.load('user')

      return response.created({
        message: 'Health practitioner created',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role?.name,
          status: user.status,
        },
        practitioner,
      })
    } catch (e: any) {
      await trx.rollback()
      return response.badRequest({
        message: 'Failed to create health practitioner',
        error: e.messages || e.message,
      })
    }
  }
  public async show({ params, response, auth }: HttpContext) {
    try {
      const me = auth.user
      if (!me) return response.status(401).json({ message: 'Unauthorized' })
      await me.load('role')

      const user = await User.query()
        .where('id', params.id)
        .preload('role')
        .preload('healthPractitioner')
        .preload('supplier')
        .firstOrFail()

      if (me.role.name !== 'super_admin' && me.id !== user.id) {
        return response.status(403).json({ message: 'Unauthorized to view this user' })
      }

      const roleName = user.role?.name
      const hp = user.healthPractitioner
      const sp = user.supplier

      const status =
        roleName === 'health_practitioner'
          ? (hp?.status ?? user.status)
          : roleName === 'supplier'
            ? (sp?.status ?? user.status)
            : user.status

      return response.json({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          roleId: user.roleId,
          role: roleName,
          status,
          location: hp?.location ?? sp?.location ?? user.location,
          specialization: hp?.specialization ?? sp?.specialization ?? null,
          licenseNumber: hp?.licenseNumber ?? null,
          businessName: sp?.businessName ?? user.businessName ?? null,
          createdAt: user.createdAt,
        },
      })
    } catch {
      return response.status(404).json({ message: 'User not found' })
    }
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      const me = auth.user
      if (!me) {
        await trx.rollback()
        return response.status(401).json({ message: 'Unauthorized' })
      }
      await me.load('role')

      const payload = await request.validateUsing(updateUserValidator)
      const specialization = request.input('specialization')

      const user = await User.findOrFail(params.id)
      user.useTransaction(trx)
      await user.load('role')

      if (me.role.name !== 'super_admin' && me.id !== user.id) {
        await trx.rollback()
        return response.status(403).json({ message: 'Unauthorized to update this user' })
      }

      if ((payload as any).status && me.role.name !== 'super_admin') {
        delete (payload as any).status
      }

      user.merge(payload)
      await user.save()

      // mirror users.location into health_practitioners and ensure row exists
      await HealthPractitioner.updateOrCreate(
        { userId: user.id },
        {
          status: user.status,
          location: user.location ?? null,
        },
        { client: trx }
      )

      // apply specialization if provided
      if (specialization !== undefined) {
        await HealthPractitioner.updateOrCreate(
          { userId: user.id },
          { specialization },
          { client: trx }
        )
      }

      await trx.commit()

      await user.load('healthPractitioner')
      await user.load('supplier')

      const roleName = user.role?.name
      const hp = user.healthPractitioner
      const sp = user.supplier

      const status =
        roleName === 'health_practitioner'
          ? (hp?.status ?? user.status)
          : roleName === 'supplier'
            ? (sp?.status ?? user.status)
            : user.status

      return response.json({
        message: 'User updated successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          roleId: user.roleId,
          role: roleName,
          status,
          location: user.location ?? hp?.location ?? sp?.location ?? null,
          specialization: hp?.specialization ?? sp?.specialization ?? null,
          licenseNumber: hp?.licenseNumber ?? null,
          businessName: sp?.businessName ?? user.businessName ?? null,
        },
      })
    } catch (error) {
      try {
        await trx.rollback()
      } catch {}
      return response.status(400).json({
        message: 'Failed to update user',
        errors: (error as any).messages || (error as any).message,
      })
    }
  }

  public async approve({ params, response, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      const me = auth.user
      if (!me) {
        await trx.rollback()
        return response.status(401).json({ message: 'Unauthorized' })
      }
      await me.load('role')
      if (me.role.name !== 'super_admin') {
        await trx.rollback()
        return response.status(403).json({ message: 'Only super admin can approve users' })
      }

      const user = await User.findOrFail(params.id)
      user.useTransaction(trx)
      user.status = 'active'
      await user.save()

      // load role to know whether to touch hp
      await user.load('role')

      if (user.role?.name === 'health_practitioner') {
        // prefer updateOrCreate for atomic upsert
        await HealthPractitioner.updateOrCreate(
          { userId: user.id },
          { status: user.status, location: user.location ?? null },
          { client: trx }
        )
      }

      await user.load('supplier')
      if (user.supplier) {
        await trx.from('suppliers').where('user_id', user.id).update({ status: 'active' })
      }

      await trx.commit()

      await user.load('healthPractitioner')
      const roleName = user.role?.name
      const status =
        roleName === 'health_practitioner'
          ? (user.healthPractitioner?.status ?? user.status)
          : user.status

      return response.json({
        message: 'User approved successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roleId: user.roleId,
          role: roleName,
          status,
        },
      })
    } catch (e: any) {
      try {
        await trx.rollback()
      } catch {}
      if (e && e.name === 'ModelNotFoundException') {
        return response.status(404).json({ message: 'User not found' })
      }
      return response
        .status(500)
        .json({ message: 'Approval failed', error: e.message ?? String(e) })
    }
  }

  public async suspend({ params, response, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      const me = auth.user
      if (!me) {
        await trx.rollback()
        return response.status(401).json({ message: 'Unauthorized' })
      }
      await me.load('role')
      if (me.role.name !== 'super_admin') {
        await trx.rollback()
        return response.status(403).json({ message: 'Only super admin can suspend users' })
      }

      const user = await User.findOrFail(params.id)
      user.useTransaction(trx)
      user.status = 'suspended'
      await user.save()

      await user.load('role')

      if (user.role?.name === 'health_practitioner') {
        await HealthPractitioner.updateOrCreate(
          { userId: user.id },
          { status: user.status, location: user.location ?? null },
          { client: trx }
        )
      }

      await user.load('supplier')
      if (user.supplier) {
        await trx.from('suppliers').where('user_id', user.id).update({ status: 'suspended' })
      }

      await trx.commit()

      await user.load('healthPractitioner')
      const roleName = user.role?.name
      const status =
        roleName === 'health_practitioner'
          ? (user.healthPractitioner?.status ?? user.status)
          : user.status

      return response.json({
        message: 'User suspended successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roleId: user.roleId,
          role: roleName,
          status,
        },
      })
    } catch (e: any) {
      try {
        await trx.rollback()
      } catch {}
      if (e && e.name === 'ModelNotFoundException') {
        return response.status(404).json({ message: 'User not found' })
      }
      return response.status(500).json({ message: 'Suspend failed', error: e.message ?? String(e) })
    }
  }

  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const me = auth.user
      if (!me) return response.status(401).json({ message: 'Unauthorized' })
      await me.load('role')
      if (me.role.name !== 'super_admin') {
        return response.status(403).json({ message: 'Only super admin can delete users' })
      }

      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.json({ message: 'User deleted successfully' })
    } catch {
      return response.status(404).json({ message: 'User not found' })
    }
  }
}
