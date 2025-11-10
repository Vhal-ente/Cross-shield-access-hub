import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { DateTime } from 'luxon'

export default class Referral extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column()
  public referredName!: string

  @column()
  public referredPhone!: string

  @column()
  public referredEmail?: string

  @column()
  public referredAddress?: string

  @column()
  public referralType!: 'health_practitioner' | 'supplier' | 'diaspora' | 'beneficiary'

  @column()
  public metadata?: any

  @column()
  public status: 'pending' | 'processed' | 'paid' | 'active' = 'active'

  @column()
  public referralCode!: string

  @column()
  public referredUserId?: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>
}
