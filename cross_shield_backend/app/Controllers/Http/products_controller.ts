import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class ProductsController {
  public async index({ response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
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
        error: error.message.errors,
      })
    }
  }

  public async store({ request, response, auth }: HttpContext) {
    const productValidator = vine.compile(vine.object({
      name: vine.string(),
      description: vine.string().optional(),
      price: vine.number().positive(),
      quantity: vine.number().positive(),
      expiryDate: vine.date(),
      nafdacNumber: vine.string().optional(),
    }))

    try {
      const payload = await request.validateUsing(productValidator)
      const user = auth.getUserOrFail()

      if (user.role !== 'supplier') {
        return response.status(403).json({
          message: 'Only suppliers can create products',
        })
      }

      const product = await Product.create({
        ...payload,
        supplierId: user.id,
        status: 'pending',
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

  public async update({ params, request, response, auth }: HttpContext) {
    const updateValidator = vine.compile(vine.object({
      name: vine.string().optional(),
      description: vine.string().optional(),
      price: vine.number().positive().optional(),
      quantity: vine.number().positive().optional(),
      expiryDate: vine.date().optional(),
      nafdacNumber: vine.string().optional(),
      status: vine.enum(['pending', 'approved', 'rejected']).optional(),
    }))

    try {
      const payload = await request.validateUsing(updateValidator)
      const user = auth.getUserOrFail()

      const product = await Product.findOrFail(params.id)

      // Check authorization
      if (user.role !== 'super_admin' && product.supplierId !== user.id) {
        return response.status(403).json({
          message: 'Unauthorized to update this product',
        })
      }

      product.merge(payload)
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

  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
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

  public async approve({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

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

  public async reject({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

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