import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
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

interface UserAttributes {
  id: number
  fullName: string
  email: string
  role: string
  status: string
  location?: string | null
  licenseNumber?: string | null
  businessName?: string | null
}
export default class User extends compose(BaseModel, AuthFinder) implements UserAttributes {
  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'super_admin' | 'health_practitioner' | 'supplier' | 'diaspora' | 'beneficiary'

  @column()
  declare status: 'active' | 'pending' | 'suspended'

  @column()
  declare location: string | null

  @column()
  declare licenseNumber: string | null

  @column()
  declare businessName: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @beforeSave()
  // public static async hashPassword(user: User) {
  //   if (user.$dirty.password) {
  //     user.password = await hash.make(user.password)
  //   }
  // }

  @hasMany(() => MedicationRequest)
  declare medicationRequests: HasMany<typeof MedicationRequest>

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  @hasMany(() => Beneficiary)
  declare beneficiaries: HasMany<typeof Beneficiary>
}
