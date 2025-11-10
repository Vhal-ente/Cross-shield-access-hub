import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user' // Adjust the path as necessary

export default class Beneficiary extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare diasporaId: number

  @column()
  declare name: string

  @column()
  declare phone: string

  @column()
  declare email: string

  @column()
  declare location: string

  @column()
  declare medicationNeeds: string | null

  @column()
  declare status: 'active' | 'inactive'

  // referral support
  @column()
  declare referred: boolean

  @column()
  declare referralNote: string | null

  @column.dateTime()
  declare referredAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'diasporaId',
  })
  declare diaspora: BelongsTo<typeof User>
}
