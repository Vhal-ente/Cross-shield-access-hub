import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import MedicationRequest from './MedicationRequest'
import Product from './Product'
import Beneficiary from './Beneficiary'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fullName: string

  @column()
  public email: string

  @column()
  public phone: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: 'super_admin' | 'health_practitioner' | 'supplier' | 'diaspora' | 'beneficiary'

  @column()
  public status: 'active' | 'pending' | 'suspended'

  @column()
  public location: string | null

  @column()
  public licenseNumber: string | null

  @column()
  public businessName: string | null

  @column()
  public rememberMeToken: string | null

  @column.dateTime()
  public emailVerifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => MedicationRequest)
  public medicationRequests: HasMany<typeof MedicationRequest>

  @hasMany(() => Product, {
    foreignKey: 'supplierId',
  })
  public products: HasMany<typeof Product>

  @hasMany(() => Beneficiary, {
    foreignKey: 'diasporaId',
  })
  public beneficiaries: HasMany<typeof Beneficiary>
}