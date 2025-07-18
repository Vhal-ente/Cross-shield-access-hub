import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public supplierId: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public price: number

  @column()
  public quantity: number

  @column.date()
  public expiryDate: DateTime

  @column()
  public nafdacNumber: string | null

  @column()
  public imageUrl: string | null

  @column()
  public status: 'pending' | 'approved' | 'rejected'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'supplierId',
  })
  public supplier: BelongsTo<typeof User>
}