import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    location: vine.string().optional(),
    phone: vine.string().optional(),
    email: vine.string().email().optional(),
    businessName: vine.string().optional(),
    description: vine.string().optional(),
    price: vine.number().positive().optional(),
    quantity: vine.number().positive().optional(),
    nafdacNumber: vine.string().optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    location: vine.string().optional(),
    phone: vine.string().optional(),
    email: vine.string().email().optional(),
    businessName: vine.string(),
    description: vine.string().optional(),
    price: vine.number().positive().optional(),
    quantity: vine.number().positive().optional(),
    nafdacNumber: vine.string().optional(),
    status: vine.enum(['pending', 'approved', 'rejected']).optional(),
  })
)
