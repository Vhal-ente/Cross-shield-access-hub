import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const user = auth.user!

      if (user.role !== 'super_admin') {
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
        error: error.message.errors,
      })
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    try {
      const currentUser = auth.user!
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
      if (currentUser.role !== 'super_admin' && currentUser.id !== user.id) {
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

  public async update({ params, request, response, auth }: HttpContextContract) {
    const updateSchema = schema.create({
      fullName: schema.string.optional(),
      phone: schema.string.optional(),
      location: schema.string.optional(),
      licenseNumber: schema.string.optional(),
      businessName: schema.string.optional(),
      status: schema.enum.optional(['active', 'pending', 'suspended'] as const),
    })

    try {
      const payload = await request.validate({ schema: updateSchema })
      const currentUser = auth.user!

      const user = await User.findOrFail(params.id)

      // Check authorization
      if (currentUser.role !== 'super_admin' && currentUser.id !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this user',
        })
      }

      // Only super admin can change status
      if (payload.status && currentUser.role !== 'super_admin') {
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
        errors: error.messages.errors || error.message.errors,
      })
    }
  }

  public async approve({ params, response, auth }: HttpContextContract) {
    try {
      const currentUser = auth.user!

      if (currentUser.role !== 'super_admin') {
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

  public async suspend({ params, response, auth }: HttpContextContract) {
    try {
      const currentUser = auth.user!

      if (currentUser.role !== 'super_admin') {
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

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const currentUser = auth.user!

      if (currentUser.role !== 'super_admin') {
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
