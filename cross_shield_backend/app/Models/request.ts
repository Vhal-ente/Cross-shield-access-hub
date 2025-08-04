// // app/models/request.ts
// import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
// import User from './user.js'
// import { DateTime } from 'luxon'
// import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// export default class Request extends BaseModel {
//   @column({ isPrimary: true })
//   declare id: number

//   @column()
//   declare type: string

//   @column()
//   declare requestedById: number

//   @column()
//   declare medication: string

//   @column()
//   declare quantity: number

//   @column()
//   declare status: 'pending' | 'in_progress' | 'fulfilled' | 'rejected'

//   @column()
//   declare assignedToId: number | null

//   @column()
//   declare description: string | null

//   @column()
//   declare urgency: 'low' | 'medium' | 'high'

//   @column()
//   declare notes: string | null
//   @column.dateTime({ autoCreate: true })
//   declare createdAt: DateTime

//   @column.dateTime({ autoCreate: true, autoUpdate: true })
//   declare updatedAt: DateTime

//   @belongsTo(() => User, { foreignKey: 'requestedById' })
//   declare requestedBy: BelongsTo<typeof User>

//   @belongsTo(() => User, { foreignKey: 'assignedToId' })
//   declare assignedTo: BelongsTo<typeof User>
// }

// app/models/request.ts
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Request extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  /**
   * Type of request: 'medication', 'beneficiary', 'supplier', 'health_professional'
   */
  @column()
  declare type: 'medication' | 'beneficiary' | 'supplier' | 'health_professional'

  /**
   * Optional sub-type or context, depending on the form
   */
  @column()
  declare category: string | null

  @column()
  declare requestedById: number

  @column()
  declare assignedToId: number | null

  @column()
  declare status: 'pending' | 'in_progress' | 'fulfilled' | 'rejected'

  /**
   * Common fields (optional depending on type)
   */
  @column()
  declare medication: string | null

  @column()
  declare quantity: number | null

  @column()
  declare urgency: 'normal' | 'urgent' | 'emergency' | null

  @column()
  declare description: string | null

  @column()
  declare notes: string | null

  @column()
  declare businessName: string | null // For suppliers

  @column()
  declare payload: string | null // JSON string for dynamic/custom fields

  @column()
  public medications: Array<{ name: string; quantity: number }> | null = null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'requestedById' })
  declare requestedBy: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'assignedToId' })
  declare assignedTo: BelongsTo<typeof User>
}
