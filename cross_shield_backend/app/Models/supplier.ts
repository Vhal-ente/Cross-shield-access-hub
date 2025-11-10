// app/models/supplier.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Product from '#models/product'

export default class Supplier extends BaseModel {
  public static table = 'suppliers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare businessName: string | null

  @column()
  declare specialization: string | null

  @column()
  declare location: string | null

  @column()
  declare payload: string | null // use jsonb in DB if you prefer

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Product, { foreignKey: 'supplierId' })
  declare products: HasMany<typeof Product>
}
