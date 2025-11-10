import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import PractitionerResponse from './practitioner_response.js'

export default class HealthPractitioner extends BaseModel {
  public static table = 'health_practitioners'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare specialization: string | null

  @column()
  declare status: 'active' | 'suspended' | 'pending' | 'rejected'

  @column()
  declare licenseNumber: string | null

  @column()
  declare location: string | null

  @column()
  declare payload: Record<string, unknown> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => PractitionerResponse, {
    foreignKey: 'practitionerId',
  })
  public responses!: HasMany<typeof PractitionerResponse>
}
