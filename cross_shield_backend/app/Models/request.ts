// app/models/request.ts
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Request extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

  @column()
  declare requestedById: number

  @column()
  declare medication: string

  @column()
  declare quantity: number

  @column()
  declare status: 'pending' | 'in_progress' | 'fulfilled' | 'rejected'

  @column()
  declare assignedToId: number | null

  @column()
  declare description: string | null

  @column()
  declare urgency: 'low' | 'medium' | 'high'

  @column()
  declare notes: string | null
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'requestedById' })
  declare requestedBy: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'assignedToId' })
  declare assignedTo: BelongsTo<typeof User>
}
