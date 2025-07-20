import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

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
  declare location: string

  @column()
  declare medicationNeeds: string | null

  @column()
  declare status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'diasporaId',
  })
  declare diaspora: BelongsTo<typeof User>
}
