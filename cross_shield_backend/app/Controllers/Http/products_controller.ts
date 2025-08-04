import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import User from '#models/user'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { DateTime } from 'luxon'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User
      let products

      if (user.role.name === 'super_admin') {
        products = await Product.query().preload('supplier').orderBy('created_at', 'desc')
      } else if (user.role.name === 'supplier') {
        products = await Product.query().where('supplier_id', user.id).orderBy('created_at', 'desc')
      } else {
        products = await Product.query()
          .where('status', 'approved')
          .preload('supplier')
          .orderBy('created_at', 'desc')
      }

      return response.json({
        products,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch products',
        error: error.message,
      })
    }
  }

  // public async store({ request, response, auth }: HttpContext) {
  //   try {
  //     const payload = await request.validateUsing(createProductValidator)
  //     const user = auth.user

  //     if (!user || user.role.name !== 'supplier') {
  //       return response.status(403).json({
  //         message: 'Only suppliers can create products',
  //       })
  //     }

  //     const product = await Product.create({
  //       ...payload,
  //       supplierId: user.id,
  //       status: 'pending',
  //       businessName: user.businessName || undefined,
  //     })

  //     await product.load('supplier')

  //     return response.status(201).json({
  //       message: 'Product created successfully',
  //       product,
  //     })
  //   } catch (error) {
  //     return response.status(400).json({
  //       message: 'Failed to create product',
  //       errors: error.messages || error.message,
  //     })
  //   }
  // }

  public async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user

      if (!user) {
        return response.status(401).json({
          message: 'User not authenticated',
        })
      }

      // Load role if not already loaded
      const allowedRoles = ['supplier']
      if (!user.role) {
        await user.load('role')
      }

      console.log('User role after load:', user.role)

      if (!allowedRoles.includes(user.role.name)) {
        return response.status(403).json({
          message: 'Only suppliers can create products',
          userRole: user.role?.name || 'no role',
        })
      }

      // Check content type and handle accordingly
      const contentType = request.header('content-type') || ''
      let payload

      if (contentType.includes('multipart/form-data')) {
        // Handle FormData
        console.log('Processing FormData...')

        // Get all form fields
        const formData = request.all()
        console.log('FormData fields:', formData)

        // Manual validation for FormData (since validator might not work with FormData)
        const requiredFields = ['name', 'phone', 'email', 'location', 'businessName']
        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0) {
          return response.status(400).json({
            message: 'Validation failed',
            errors: {
              message: `Missing required fields: ${missingFields.join(', ')}`,
              fields: missingFields,
            },
          })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          return response.status(400).json({
            message: 'Validation failed',
            errors: {
              email: ['Please enter a valid email address'],
            },
          })
        }

        // Validate phone format
        const phoneRegex = /^\+?\d{10,15}$/
        if (!phoneRegex.test(formData.phone)) {
          return response.status(400).json({
            message: 'Validation failed',
            errors: {
              phone: ['Please enter a valid phone number'],
            },
          })
        }

        payload = formData
      } else if (contentType.includes('application/json')) {
        // Handle JSON - use existing validator
        console.log('Processing JSON...')
        payload = await request.validateUsing(createProductValidator)
      } else {
        return response.status(400).json({
          message: 'Unsupported content type. Use either application/json or multipart/form-data',
        })
      }

      console.log('Final payload:', payload)

      // Create product with validated payload
      const product = await Product.create({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        location: payload.location,
        businessName: payload.businessName,
        supplierId: user.id,
        status: 'pending',
        // Add any other fields from your Product model
      })

      await product.load('supplier')

      return response.status(201).json({
        message: 'Product created successfully',
        product,
      })
    } catch (error) {
      console.error('Product creation error:', error)
      return response.status(400).json({
        message: 'Failed to create product',
        errors: error.messages || error.message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const product = await Product.query().where('id', params.id).preload('supplier').firstOrFail()

      return response.json({
        product,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Product not found',
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateProductValidator)
      const user = (response as any).locals.user as User

      const product = await Product.findOrFail(params.id)

      // Check authorization
      if (user.role.name !== 'super_admin' && product.supplierId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this product',
        })
      }

      product.merge({
        ...payload,
        // expiryDate: payload.expiryDate ? DateTime.fromJSDate(payload.expiryDate) : undefined, // Convert to DateTime or set to undefined
      })
      await product.save()

      await product.load('supplier')

      return response.json({
        message: 'Product updated successfully',
        product,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update product',
        errors: error.messages || error.message,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User
      const product = await Product.findOrFail(params.id)

      // Check authorization
      if (user.role.name !== 'super_admin' && product.supplierId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to delete this product',
        })
      }

      await product.delete()

      return response.json({
        message: 'Product deleted successfully',
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Product not found',
      })
    }
  }

  public async approve({ params, response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User

      if (user.role.name !== 'super_admin') {
        return response.status(403).json({
          message: 'Only super admin can approve products',
        })
      }

      const product = await Product.findOrFail(params.id)
      product.status = 'approved'
      await product.save()

      await product.load('supplier')

      return response.json({
        message: 'Product approved successfully',
        product,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Product not found',
      })
    }
  }

  public async reject({ params, response }: HttpContext) {
    try {
      const user = (response as any).locals.user as User

      if (user.role.name !== 'super_admin') {
        return response.status(403).json({
          message: 'Only super admin can reject products',
        })
      }

      const product = await Product.findOrFail(params.id)
      product.status = 'rejected'
      await product.save()

      await product.load('supplier')

      return response.json({
        message: 'Product rejected successfully',
        product,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Product not found',
      })
    }
  }
}
