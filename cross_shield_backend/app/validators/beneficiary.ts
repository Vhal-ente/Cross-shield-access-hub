import vine from '@vinejs/vine'

export const createBeneficiaryValidator = vine.compile(
  vine.object({
    name: vine.string(),
    phone: vine.string(),
    location: vine.string(),
    medicationNeeds: vine.string().optional(),
  })
)

export const updateBeneficiaryValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    phone: vine.string().optional(),
    location: vine.string().optional(),
    medicationNeeds: vine.string().optional(),
    status: vine.enum(['active', 'inactive']).optional(),
  })
)
