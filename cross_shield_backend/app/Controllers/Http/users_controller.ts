import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'

export default class UsersController {
  public async index({ response }: HttpContext) {
    try {
      const currentUser = (response as any).locals.user as User

      if (currentUser.role.name !== 'super_admin') {
        return response.status(403).json({
          message: 'Only super admin can view all users',
        })
      }

      const users = await User.query()
        .select(
          'id',
          'full_name',
          'email',
          'phone',
          'role',
          'status',
          'location',
          'license_number',
          'business_name',
          'created_at'
        )
        .orderBy('created_at', 'desc')

      return response.json({
        users,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch users',
        error: error.message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const currentUser = (response as any).locals.user as User
      const user = await User.query()
        .select(
          'id',
          'full_name',
          'email',
          'phone',
          'role',
          'status',
          'location',
          'license_number',
          'business_name',
          'created_at'
        )
        .where('id', params.id)
        .firstOrFail()

      // Check authorization
      if (currentUser.role.name !== 'super_admin' && currentUser.id !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to view this user',
        })
      }

      return response.json({
        user,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateUserValidator)
      const currentUser = (response as any).locals.user as User

      const user = await User.findOrFail(params.id)

      // Check authorization
      if (currentUser.role.name !== 'super_admin' && currentUser.id !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this user',
        })
      }

      // Only super admin can change status
      if (payload.status && currentUser.role.name !== 'super_admin') {
        delete payload.status
      }

      user.merge(payload)
      await user.save()

      return response.json({
        message: 'User updated successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          location: user.location,
          licenseNumber: user.licenseNumber,
          businessName: user.businessName,
        },
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update user',
        errors: error.messages || error.message,
      })
    }
  }

  public async approve({ params, response }: HttpContext) {
    try {
      const currentUser = (response as any).locals.user as User

      if (currentUser.role.name !== 'super_admin') {
        return response.status(403).json({
          message: 'Only super admin can approve users',
        })
      }

      const user = await User.findOrFail(params.id)
      user.status = 'active'
      await user.save()

      return response.json({
        message: 'User approved successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
  }

  public async suspend({ params, response }: HttpContext) {
    try {
      const currentUser = (response as any).locals.user as User

      if (currentUser.role.name !== 'super_admin') {
        return response.status(403).json({
          message: 'Only super admin can suspend users',
        })
      }

      const user = await User.findOrFail(params.id)
      user.status = 'suspended'
      await user.save()

      return response.json({
        message: 'User suspended successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const currentUser = (response as any).locals.user as User

      if (currentUser.role.name !== 'super_admin') {
        return response.status(403).json({
          message: 'Only super admin can delete users',
        })
      }

      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.json({
        message: 'User deleted successfully',
      })
    } catch (error) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
  }
}
