import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, beforeSave, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import MedicationRequest from './medication_request.js'
import Product from './product.js'
import Beneficiary from './beneficiary.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User)

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
      user.password = await hash.make(user.password)
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