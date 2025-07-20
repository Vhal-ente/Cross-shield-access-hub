import vine from '@vinejs/vine'

export const createMedicationRequestValidator = vine.compile(
  vine.object({
    medicationName: vine.string(),
    quantity: vine.number().positive(),
    urgency: vine.enum(['normal', 'urgent', 'emergency']),
    medicalCondition: vine.string().optional(),
    notes: vine.string().optional(),
    beneficiaryId: vine.number().positive().optional(),
  })
)

export const updateMedicationRequestValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'in_progress', 'fulfilled', 'cancelled']).optional(),
    assignedTo: vine.number().positive().optional(),
    price: vine.number().positive().optional(),
    notes: vine.string().optional(),
  })
)
