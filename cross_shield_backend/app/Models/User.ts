// import { DateTime } from 'luxon'
// import { compose } from '@adonisjs/core/helpers'
// import hash from '@adonisjs/core/services/hash'
// import { BaseModel, column, hasMany, belongsTo, hasOne } from '@adonisjs/lucid/orm'
// import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
// import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
// import type { HasMany, BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
// import Role from '#models/role'
// import MedicationRequest from '#models/medication_request'
// import Supplier from '#models/supplier'
// import Beneficiary from '#models/beneficiary' // Adjust the path as necessary
// import HealthPractitioner from '#models/health_practitioner' // Adjust the path as necessary

// const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
//   uids: ['email'],
//   passwordColumnName: 'password',
// })

// interface UserAttributes {
//   id: number
//   fullName: string
//   email: string
//   roleId: number
//   status: string
//   location?: string | null
//   licenseNumber?: string | null
//   businessName?: string | null
// }

// export default class User extends compose(BaseModel, AuthFinder) implements UserAttributes {
//   [x: string]: any
//   // static accessTokens = DbAccessTokensProvider.forModel(User)
//   static accessTokens = DbAccessTokensProvider.forModel(User, {
//     expiresIn: '1 days',
//     prefix: 'oat_',
//     table: 'access_tokens',
//     type: 'auth_token',
//     tokenSecretLength: 40,
//   })

//   @column({ isPrimary: true })
//   declare id: number

//   @column()
//   declare fullName: string

//   @column()
//   declare email: string

//   @column()
//   declare phone: string | null

//   @column({ serializeAs: null })
//   declare password: string

//   @column()
//   declare roleId: number

//   @column()
//   declare status: 'active' | 'pending' | 'suspended' | 'rejected'

//   @column()
//   declare location: string | null

//   @column()
//   declare licenseNumber: string | null

//   @column()
//   declare businessName: string | null

//   @column.dateTime({ autoCreate: true })
//   declare createdAt: DateTime

//   @column.dateTime({ autoCreate: true, autoUpdate: true })
//   declare updatedAt: DateTime

//   // Relationships
//   @belongsTo(() => Role, {
//     foreignKey: 'roleId',
//   })
//   declare role: BelongsTo<typeof Role>

//   @hasMany(() => MedicationRequest)
//   declare medicationRequests: HasMany<typeof MedicationRequest>

//   @hasOne(() => Supplier, { foreignKey: 'userId' })
//   declare supplier: HasOne<typeof Supplier>

//   @hasMany(() => Beneficiary, { foreignKey: 'diasporaId' })
//   declare beneficiaries: HasMany<typeof Beneficiary>

//   @hasOne(() => HealthPractitioner, { foreignKey: 'userId' })
//   declare healthPractitioner: HasOne<typeof HealthPractitioner>

//   // Helper method to check permissions
//   async hasPermission(permissionName: string): Promise<boolean> {
//     await this.load('role', (roleQuery) => {
//       roleQuery.preload('permissions')
//     })
//     if (!this.role || !this.role.permissions) return false

//     return this.role.permissions.some(
//       (permission) => permission.name === permissionName && permission.isActive
//     )
//   }

//   // Helper method to get all permissions
//   async getPermissions(): Promise<string[]> {
//     await this.load('role', (roleQuery) => {
//       roleQuery.preload('permissions')
//     })
//     if (!this.role || !this.role.permissions) return []

//     return this.role.permissions
//       .filter((permission) => permission.isActive)
//       .map((permission) => permission.name)
//   }
// }

import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import MedicationRequest from '#models/medication_request'
import Supplier from '#models/supplier'
import Beneficiary from '#models/beneficiary'
import HealthPractitioner from '#models/health_practitioner'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

interface UserAttributes {
  id: number
  fullName: string
  email: string
  roleId: number
  status: string
  location?: string | null
  licenseNumber?: string | null
  businessName?: string | null
}

export default class User extends compose(BaseModel, AuthFinder) implements UserAttributes {
  // static accessTokens = DbAccessTokensProvider.forModel(User)
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 days',
    prefix: 'oat_',
    table: 'access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare roleId: number

  @column()
  declare status: 'active' | 'pending' | 'suspended' | 'rejected'

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

  // Relationships
  @belongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof Role>

  // Access the loaded Role model safely
  get roleModel() {
    return this.$preloaded.role as Role | undefined
  }

  @hasMany(() => MedicationRequest)
  declare medicationRequests: HasMany<typeof MedicationRequest>

  @hasOne(() => Supplier, { foreignKey: 'userId' })
  declare supplier: HasOne<typeof Supplier>

  @hasMany(() => Beneficiary, { foreignKey: 'diasporaId' })
  declare beneficiaries: HasMany<typeof Beneficiary>

  @hasOne(() => HealthPractitioner, { foreignKey: 'userId' })
  declare healthPractitioner: HasOne<typeof HealthPractitioner>

  // Helper method to check permissions
  async hasPermission(permissionName: string): Promise<boolean> {
    await this.load('role')
    const role = this.roleModel
    if (!role) return false

    await role.load('permissions')
    return role.permissions?.some((p) => p.name === permissionName && p.isActive) ?? false
  }

  // Helper method to get all permissions
  async getPermissions(): Promise<string[]> {
    await this.load('role')
    const role = this.roleModel
    if (!role) return []

    await role.load('permissions')
    return (role.permissions || []).filter((p) => p.isActive).map((p) => p.name)
  }
}
