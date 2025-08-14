import vine from '@vinejs/vine'
/**
 * @file Medication Request Validators
 * @description This file contains validators for creating and updating medication requests.
 */
export const createMedicationRequestValidator = vine.compile(
  vine.object({
    medications: vine
      .array(
        vine.object({
          name: vine.string(),
          quantity: vine.number().positive(),
          unit: vine.string().optional(),
        })
      )
      .minLength(1),
    urgency: vine.enum(['normal', 'urgent', 'emergency']),
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
