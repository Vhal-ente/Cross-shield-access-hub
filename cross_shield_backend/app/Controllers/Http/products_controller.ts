import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class ProductsController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
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

  public async store({ request, response, auth }: HttpContextContract) {
    const productSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      description: schema.string.optional(),
      price: schema.number([rules.required(), rules.unsigned()]),
      quantity: schema.number([rules.required(), rules.unsigned()]),
      expiryDate: schema.date({}, [rules.required()]),
      nafdacNumber: schema.string.optional(),
    })

    try {
      const payload = await request.validate({ schema: productSchema })
      const user = auth.user!

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
        errors: error.messages.errors || error.message.errors,
      })
    }
  }

  public async show({ params, response }: HttpContextContract) {
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

  public async update({ params, request, response, auth }: HttpContextContract) {
    const updateSchema = schema.create({
      name: schema.string.optional(),
      description: schema.string.optional(),
      price: schema.number.optional([rules.unsigned()]),
      quantity: schema.number.optional([rules.unsigned()]),
      expiryDate: schema.date.optional(),
      nafdacNumber: schema.string.optional(),
      status: schema.enum.optional(['pending', 'approved', 'rejected'] as const),
    })

    try {
      const payload = await request.validate({ schema: updateSchema })
      const user = auth.user!

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
        errors: error.messages.errors || error.message.errors,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
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

  public async approve({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!

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

  public async reject({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!

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
