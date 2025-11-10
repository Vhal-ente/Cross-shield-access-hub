import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'

export default class Product extends BaseModel {
  public static table = 'products'

  @column({ isPrimary: true })
  declare id: number

  // link to supplier profile (not user)
  @column()
  declare supplierId: number

  @column()
  declare name: string

  @column()
  declare details: string | null

  @column.dateTime()
  declare expirationDate: DateTime | null

  @column()
  declare price: number | null

  @column()
  declare image: string | null

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Supplier, { foreignKey: 'supplierId' })
  declare supplier: BelongsTo<typeof Supplier>
}
