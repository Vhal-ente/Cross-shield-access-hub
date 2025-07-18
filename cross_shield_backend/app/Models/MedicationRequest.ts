import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class MedicationRequest extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public beneficiaryId: number | null

  @column()
  public medicationName: string

  @column()
  public quantity: number

  @column()
  public urgency: 'normal' | 'urgent' | 'emergency'

  @column()
  public medicalCondition: string | null

  @column()
  public notes: string | null

  @column()
  public prescriptionImage: string | null

  @column()
  public status: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled'

  @column()
  public assignedTo: number | null

  @column()
  public price: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'assignedTo',
  })
  public assignedUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'beneficiaryId',
  })
  public beneficiary: BelongsTo<typeof User>
}