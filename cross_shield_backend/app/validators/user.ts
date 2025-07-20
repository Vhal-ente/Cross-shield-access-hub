import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().optional(),
    phone: vine.string().optional(),
    location: vine.string().optional(),
    licenseNumber: vine.string().optional(),
    businessName: vine.string().optional(),
    status: vine.enum(['active', 'pending', 'suspended']).optional(),
  })
)
