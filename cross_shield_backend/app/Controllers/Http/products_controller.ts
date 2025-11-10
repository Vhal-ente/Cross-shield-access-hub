// // app/controllers/http/suppliers_controller.ts
// import type { HttpContext } from '@adonisjs/core/http'
// import Supplier from '#models/supplier'
// import User from '#models/user'

// export default class SuppliersController {
//   // GET /api/suppliers
//   public async index({ auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')

//       if (me.role.name === 'super_admin') {
//         const rows = await Supplier.query().preload('user').orderBy('created_at', 'desc')
//         return response.json({ suppliers: rows })
//       }

//       if (me.role.name === 'supplier') {
//         const row = await Supplier.query().where('user_id', me.id).preload('user').first()
//         return response.json({ supplier: row })
//       }

//       return response.status(403).json({ message: 'Forbidden' })
//     } catch (error) {
//       return response
//         .status(500)
//         .json({ message: 'Failed to fetch suppliers', error: error.message })
//     }
//   }

//   // POST /api/suppliers
//   public async store({ request, auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')

//       const allowed = me.role.name === 'supplier' || me.role.name === 'super_admin'
//       if (!allowed) return response.status(403).json({ message: 'Forbidden' })

//       const body = request.only([
//         'businessName',
//         'specialization',
//         'location',
//         'status',
//         'userId',
//         'payload',
//       ])

//       const targetUserId =
//         me.role.name === 'super_admin' && body.userId ? Number(body.userId) : me.id
//       const targetUser = await User.findOrFail(targetUserId)

//       const existing = await Supplier.query().where('user_id', targetUser.id).first()
//       if (existing) return response.status(409).json({ message: 'Supplier profile already exists' })

//       const supplier = await Supplier.create({
//         userId: targetUser.id,
//         businessName: body.businessName ?? null,
//         specialization: body.specialization ?? null,
//         location: body.location ?? null,
//         status: (body.status as 'active' | 'inactive' | 'suspended') ?? 'active',
//         payload: body.payload ? JSON.stringify(body.payload) : null,
//       })

//       await supplier.load('user')
//       return response.status(201).json({ message: 'Supplier created', supplier })
//     } catch (error) {
//       return response
//         .status(400)
//         .json({ message: 'Failed to create supplier', error: error.message })
//     }
//   }

//   // GET /api/suppliers/:id
//   public async show({ params, auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')

//       const supplier = await Supplier.query().where('id', params.id).preload('user').firstOrFail()

//       if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
//         return response.status(403).json({ message: 'Forbidden' })
//       }

//       return response.json({ supplier })
//     } catch {
//       return response.status(404).json({ message: 'Supplier not found' })
//     }
//   }

//   // PUT/PATCH /api/suppliers/:id
//   public async update({ params, request, auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')

//       const supplier = await Supplier.findOrFail(params.id)

//       if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
//         return response.status(403).json({ message: 'Forbidden' })
//       }

//       const body = request.only(['businessName', 'specialization', 'location', 'status', 'payload'])

//       if (body.status && me.role.name !== 'super_admin') {
//         delete body.status
//       }

//       supplier.merge({
//         businessName: body.businessName ?? supplier.businessName,
//         specialization: body.specialization ?? supplier.specialization,
//         location: body.location ?? supplier.location,
//         status: (body.status as 'active' | 'inactive' | 'suspended') ?? supplier.status,
//         payload:
//           body.payload !== undefined
//             ? body.payload
//               ? JSON.stringify(body.payload)
//               : null
//             : supplier.payload,
//       })

//       await supplier.save()
//       await supplier.load('user')

//       return response.json({ message: 'Supplier updated', supplier })
//     } catch (error) {
//       return response
//         .status(400)
//         .json({ message: 'Failed to update supplier', error: error.message })
//     }
//   }

//   // DELETE /api/suppliers/:id
//   public async destroy({ params, auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')

//       const supplier = await Supplier.findOrFail(params.id)

//       if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
//         return response.status(403).json({ message: 'Forbidden' })
//       }

//       await supplier.delete()
//       return response.json({ message: 'Supplier deleted' })
//     } catch {
//       return response.status(404).json({ message: 'Supplier not found' })
//     }
//   }

//   // POST /api/suppliers/:id/approve
//   public async approve({ params, auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')
//       if (me.role.name !== 'super_admin') return response.status(403).json({ message: 'Forbidden' })

//       const supplier = await Supplier.findOrFail(params.id)
//       supplier.status = 'active'
//       await supplier.save()
//       await supplier.load('user')

//       return response.json({ message: 'Supplier approved', supplier })
//     } catch {
//       return response.status(404).json({ message: 'Supplier not found' })
//     }
//   }

//   // POST /api/suppliers/:id/reject
//   public async reject({ params, auth, response }: HttpContext) {
//     try {
//       const me = auth.user
//       if (!me) return response.status(401).json({ message: 'Unauthorized' })
//       await me.load('role')
//       if (me.role.name !== 'super_admin') return response.status(403).json({ message: 'Forbidden' })

//       const supplier = await Supplier.findOrFail(params.id)
//       supplier.status = 'inactive'
//       await supplier.save()
//       await supplier.load('user')

//       return response.json({ message: 'Supplier rejected', supplier })
//     } catch {
//       return response.status(404).json({ message: 'Supplier not found' })
//     }
//   }
// }

import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'
import User from '#models/user'
import Product from '#models/product'
import { schema } from '@adonisjs/validator'
import { v4 as uuidv4 } from 'uuid'

export default class SuppliersController {
  // GET /api/suppliers
  public async index({ auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    if (me.role.name === 'super_admin') {
      const rows = await Supplier.query().preload('user').orderBy('created_at', 'desc')
      return response.ok({ suppliers: rows })
    }

    if (me.role.name === 'supplier') {
      const row = await Supplier.query().where('user_id', me.id).preload('user').first()
      return response.ok({ supplier: row })
    }

    return response.forbidden({ message: 'Forbidden' })
  }

  // POST /api/suppliers
  public async store({ request, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const allowed = me.role.name === 'supplier' || me.role.name === 'super_admin'
    if (!allowed) return response.forbidden({ message: 'Forbidden' })

    const body = request.only([
      'businessName',
      'specialization',
      'location',
      'status',
      'userId',
      'payload',
    ])

    const targetUserId = me.role.name === 'super_admin' && body.userId ? Number(body.userId) : me.id
    const targetUser = await User.findOrFail(targetUserId)

    const existing = await Supplier.query().where('user_id', targetUser.id).first()
    if (existing) return response.conflict({ message: 'Supplier profile already exists' })

    const supplier = await Supplier.create({
      userId: targetUser.id,
      businessName: body.businessName ?? null,
      specialization: body.specialization ?? null,
      location: body.location ?? null,
      status: (body.status as 'active' | 'inactive' | 'suspended') ?? 'active',
      payload: body.payload ? JSON.stringify(body.payload) : null,
    })

    await supplier.load('user')
    return response.created({ message: 'Supplier created', supplier })
  }

  // GET /api/suppliers/:id
  public async show({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const supplier = await Supplier.query().where('id', params.id).preload('user').firstOrFail()

    if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
      return response.forbidden({ message: 'Forbidden' })
    }

    return response.ok({ supplier })
  }

  // PUT /api/suppliers/:id
  public async update({ params, request, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const supplier = await Supplier.findOrFail(params.id)

    if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
      return response.forbidden({ message: 'Forbidden' })
    }

    const body = request.only(['businessName', 'specialization', 'location', 'status', 'payload'])

    if (body.status && me.role.name !== 'super_admin') {
      delete body.status
    }

    supplier.merge({
      businessName: body.businessName ?? supplier.businessName,
      specialization: body.specialization ?? supplier.specialization,
      location: body.location ?? supplier.location,
      status: (body.status as 'active' | 'inactive' | 'suspended') ?? supplier.status,
      payload:
        body.payload !== undefined
          ? body.payload
            ? JSON.stringify(body.payload)
            : null
          : supplier.payload,
    })

    await supplier.save()
    await supplier.load('user')

    return response.ok({ message: 'Supplier updated', supplier })
  }

  // DELETE /api/suppliers/:id
  public async destroy({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const supplier = await Supplier.findOrFail(params.id)

    if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
      return response.forbidden({ message: 'Forbidden' })
    }

    await supplier.delete()
    return response.ok({ message: 'Supplier deleted' })
  }

  // POST /api/suppliers/:id/approve
  public async approve({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')
    if (me.role.name !== 'super_admin') return response.forbidden({ message: 'Forbidden' })

    const supplier = await Supplier.findOrFail(params.id)
    supplier.status = 'active'
    await supplier.save()
    await supplier.load('user')

    return response.ok({ message: 'Supplier approved', supplier })
  }

  // POST /api/suppliers/:id/reject
  public async reject({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')
    if (me.role.name !== 'super_admin') return response.forbidden({ message: 'Forbidden' })

    const supplier = await Supplier.findOrFail(params.id)
    supplier.status = 'inactive'
    await supplier.save()
    await supplier.load('user')

    return response.ok({ message: 'Supplier rejected', supplier })
  }

  // ---------------------------------------------------------------------------
  // Product endpoints (use supplierId)
  // ---------------------------------------------------------------------------

  // GET /api/suppliers/:supplierId/products
  public async productsIndex({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })

    const supplierId = Number(params.supplierId)
    if (Number.isNaN(supplierId)) return response.badRequest({ message: 'Invalid supplier id' })

    const products = await Product.query()
      .where('supplier_id', supplierId)
      .orderBy('created_at', 'desc')

    return response.ok({ products })
  }

  // POST /api/suppliers/:supplierId/products
  public async productsStore({ params, request, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const supplierId = Number(params.supplierId)
    if (Number.isNaN(supplierId)) return response.badRequest({ message: 'Invalid supplier id' })

    const supplier = await Supplier.find(supplierId)
    if (!supplier) return response.notFound({ message: 'Supplier not found' })

    if (me.role.name !== 'super_admin' && supplier.userId !== me.id) {
      return response.forbidden({ message: 'Forbidden' })
    }

    const productSchema = schema.create({
      name: schema.string({ trim: true }),
      details: schema.string.optional({ trim: true }),
      expiration_date: schema.date.optional(),
      price: schema.number.optional(),
    })

    await request.validate({ schema: productSchema })

    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let savedFileName: string | null = null
    if (image) {
      if (!image.isValid)
        return response.badRequest({ message: 'Invalid image', errors: image.errors })
      const filename = `${Date.now()}-${uuidv4()}.${image.extname}`
      await image.move('uploads/products', { name: filename, overwrite: false })
      savedFileName = image.fileName || filename
    }

    const created = await Product.create({
      supplierId: supplier.id,
      name: request.input('name'),
      details: request.input('details') ?? null,
      expirationDate: request.input('expiration_date') ?? null,
      price: request.input('price') ?? null,
      image: savedFileName,
      status: 'pending',
    })

    await created.load('supplier')
    return response.created({ message: 'Product created', product: created })
  }

  // GET /api/products/:id
  public async productShow({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })

    const product = await Product.query().where('id', params.id).preload('supplier').firstOrFail()

    return response.ok({ product })
  }

  // PUT /api/products/:id
  public async productUpdate({ params, request, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const product = await Product.findOrFail(params.id)
    if (me.role.name !== 'super_admin' && product.supplierId !== me.id) {
      return response.forbidden({ message: 'Forbidden' })
    }

    const body = request.only(['name', 'details', 'expiration_date', 'price', 'status'])
    if (body.expiration_date) body.expiration_date = new Date(body.expiration_date)

    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let savedFileName: string | null = null
    if (image) {
      if (!image.isValid)
        return response.badRequest({ message: 'Invalid image', errors: image.errors })
      const filename = `${Date.now()}-${uuidv4()}.${image.extname}`
      await image.move('uploads/products', { name: filename, overwrite: false })
      savedFileName = image.fileName || filename
    }

    product.merge({
      name: body.name ?? product.name,
      details: body.details ?? product.details,
      expirationDate: body.expiration_date ?? product.expirationDate,
      price: body.price ?? product.price,
      image: savedFileName ?? product.image,
      status: body.status ?? product.status,
    })

    await product.save()
    await product.load('supplier')
    return response.ok({ message: 'Product updated', product })
  }

  // DELETE /api/products/:id
  public async productDestroy({ params, auth, response }: HttpContext) {
    const me = auth.user
    if (!me) return response.unauthorized({ message: 'Unauthorized' })
    await me.load('role')

    const product = await Product.findOrFail(params.id)
    if (me.role.name !== 'super_admin' && product.supplierId !== me.id) {
      return response.forbidden({ message: 'Forbidden' })
    }

    await product.delete()
    return response.ok({ message: 'Product deleted' })
  }
}
