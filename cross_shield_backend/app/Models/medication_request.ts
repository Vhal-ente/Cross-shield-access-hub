import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Beneficiary from './beneficiary.js'

export default class MedicationRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare beneficiaryId: number | null

  @column()
  declare medicationName: string

  @column()
  declare quantity: number

  @column()
  declare urgency: 'normal' | 'urgent' | 'emergency'

  @column()
  declare medicalCondition: string | null

  @column()
  declare notes: string | null

  @column()
  declare prescriptionImage: string | null

  @column()
  declare status: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled'

  @column()
  declare assignedTo: number | null

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
