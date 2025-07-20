import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    price: vine.number().positive(),
    quantity: vine.number().positive(),
    expiryDate: vine.date(),
    nafdacNumber: vine.string().optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    price: vine.number().positive().optional(),
    quantity: vine.number().positive().optional(),
    expiryDate: vine.date().optional(),
    nafdacNumber: vine.string().optional(),
    status: vine.enum(['pending', 'approved', 'rejected']).optional(),
  })
)
