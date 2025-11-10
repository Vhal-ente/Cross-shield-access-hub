import vine from '@vinejs/vine'

// // types/request.ts
// export interface CreateUnifiedRequestPayload {
//   type: 'Medication_Request'
//   category?: string
//   medication?: string
//   quantity?: number
//   urgency?: 'low' | 'medium' | 'high' | 'normal' | 'urgent' | 'emergency'
//   description?: string
//   notes?: string
//   payload?: any
//   medications?: Array<{ name: string; quantity: number }>

export const createHealthPractitionerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(120),
    email: vine.string().trim().toLowerCase().email(),
    phone: vine.string().trim().optional(),
    location: vine.string().trim().optional(),
    specialization: vine.string().trim().optional(),
    licenseNumber: vine.string().trim().optional(),
    licenseIssuer: vine.string().trim().optional(),
    licenseExpiry: vine.date().optional(),
    payload: vine.object({}).allowUnknownProperties().optional(),
    status: vine.enum(['active', 'pending', 'suspended', 'rejected']).optional(),
  })
)

export const updateHealthPractitionerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(120).optional(),
    email: vine.string().trim().toLowerCase().email().optional(),
    phone: vine.string().trim().optional(),
    location: vine.string().trim().optional(),
    specialization: vine.string().trim().optional(),
    licenseNumber: vine.string().trim().optional(),
    payload: vine.object({}).allowUnknownProperties().optional(),
    status: vine.enum(['active', 'pending', 'suspended', 'rejected']).optional(),
  })
)
