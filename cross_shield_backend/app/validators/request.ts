import vine from '@vinejs/vine'

// types/request.ts
export interface CreateUnifiedRequestPayload {
  type: 'medication' | 'beneficiary' | 'supplier' | 'health_professional'
  category?: string
  medication?: string
  quantity?: number
  urgency?: 'low' | 'medium' | 'high' | 'normal' | 'urgent' | 'emergency'
  description?: string
  notes?: string
  payload?: any
  medications?: Array<{ name: string; quantity: number }>
}

export const createUnifiedRequestValidator = vine.compile(
  vine.object({
    type: vine.enum(['medication', 'beneficiary', 'supplier', 'health_professional']),

    description: vine.string().optional(),
    notes: vine.string().optional(),
    urgency: vine.enum(['low', 'medium', 'high', 'normal', 'urgent', 'emergency']).optional(),
    assignedToId: vine.number().optional(),
    medication: vine.string().optional(),
    quantity: vine.number().optional(),

    payload: vine
      .object({
        // These fields will depend on the `type`, but we allow all and filter in controller
        name: vine.string().optional(),
        phone: vine.string().optional(),
        email: vine.string().email().optional(),
        location: vine.string().optional(),

        // supplier-specific
        businessName: vine.string().optional(),

        // health_professional-specific
        profession: vine.string().optional(),
        licenseNumber: vine.string().optional(),

        // medication-specific - ADD THIS!
        fullName: vine.string().optional(),
        countryCode: vine.string().optional(),
        phoneNumber: vine.string().optional(),
        medications: vine
          .array(
            vine.object({
              name: vine.string(),
              quantity: vine.number(),
            })
          )
          .optional(),
      })
      .optional(),
  })
)
