import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Beneficiary from '#models/beneficiary' // Update to the correct file name

export default class MedicationRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare beneficiaryId: number | null

  @column({
    serialize: (value: any) => {
      // ✅ FIXED: Handle different input types safely
      if (value === null || value === undefined) {
        return []
      }

      // If it's already an array/object, return as-is
      if (typeof value === 'object') {
        return value
      }

      // If it's a string, try to parse it
      if (typeof value === 'string') {
        // Handle the "[object Object]" case
        if (value === '[object Object]') {
          console.error('Received "[object Object]" string in medications serialize')
          return []
        }

        try {
          const parsed = JSON.parse(value)
          return parsed
        } catch (error) {
          console.error('Failed to parse medications JSON in serialize:', value, error)
          return []
        }
      }

      // Fallback
      return []
    },
    prepare: (value: any) => {
      // ✅ FIXED: Handle different input types safely
      if (value === null || value === undefined) {
        return JSON.stringify([])
      }

      // If it's already a string, check if it's valid JSON
      if (typeof value === 'string') {
        try {
          // Validate it's proper JSON by parsing and re-stringifying
          JSON.parse(value)
          return value
        } catch {
          // If it's not valid JSON (like "[object Object]"), return empty array
          console.error('Invalid JSON string in medications prepare:', value)
          return JSON.stringify([])
        }
      }

      // If it's an object/array, stringify it
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value)
        } catch (error) {
          console.error('Failed to stringify medications in prepare:', value, error)
          return JSON.stringify([])
        }
      }

      // Fallback
      return JSON.stringify([])
    },
  })
  public medications: { name: string; quantity: number }[] = []

  @column()
  declare urgency: 'normal' | 'urgent' | 'emergency'

  @column()
  declare notes: string | null

  @column({
    columnName: 'prescription_images',
    prepare: (value: any) => {
      if (value === null || value === undefined) return null
      return typeof value === 'string' ? value : JSON.stringify(value)
    },
    serialize: (value: any) => {
      if (!value) return []
      try {
        return JSON.parse(value)
      } catch {
        return []
      }
    },
  })
  public prescriptionImages: string | string[] | null = null

  @column()
  declare status: 'pending' | 'in_progress' | 'assigned' | 'fulfilled' | 'cancelled'

  @column()
  declare assignedTo: number | null

  @column({ columnName: 'fulfilled_by' })
  public fulfilledBy?: number | null

  @column.dateTime({ columnName: 'fulfilled_at' })
  public fulfilledAt?: DateTime | null

  @column({ columnName: 'fulfillment_note' })
  public fulfillmentNote?: string | null

  @column()
  declare price: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'assignedTo',
  })
  declare assignedUser: BelongsTo<typeof User>

  @belongsTo(() => Beneficiary, {
    foreignKey: 'beneficiaryId',
  })
  declare beneficiary: BelongsTo<typeof Beneficiary>
}
