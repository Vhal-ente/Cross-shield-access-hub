import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Beneficiary extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public diasporaId: number

  @column()
  public name: string

  @column()
  public phone: string

  @column()
  public location: string

  @column()
  public medicationNeeds: string | null

  @column()
  public status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'diasporaId',
  })
  public diaspora: BelongsTo<typeof User>
}