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

      if (user.role === 'super_admin') {
        products = await Product.query().preload('supplier').orderBy('created_at', 'desc')
      } else if (user.role === 'supplier') {
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

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createProductValidator)
      const user = (response as any).locals.user as User

      if (user.role !== 'supplier') {
        return response.status(403).json({
          message: 'Only suppliers can create products',
        })
      }

      const product = await Product.create({
        ...payload,
        supplierId: user.id,
        status: 'pending',
        expiryDate: payload.expiryDate ? DateTime.fromJSDate(payload.expiryDate) : undefined, // Convert to DateTime or set to undefined
      })

      await product.load('supplier')

      return response.status(201).json({
        message: 'Product created successfully',
        product,
      })
    } catch (error) {
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
      if (user.role !== 'super_admin' && product.supplierId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this product',
        })
      }

      product.merge({
        ...payload,
        expiryDate: payload.expiryDate ? DateTime.fromJSDate(payload.expiryDate) : undefined, // Convert to DateTime or set to undefined
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
      if (user.role !== 'super_admin' && product.supplierId !== user.id) {
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

      if (user.role !== 'super_admin') {
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

      if (user.role !== 'super_admin') {
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
