import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PractitionerResponse from '#models/practitioner_response'

export default class PractitionerResponseLine extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public responseId!: number

  @column()
  public medId!: string

  @column()
  public availableQty!: number

  @column()
  public brand!: string | null

  @column()
  public availability!: string

  @column()
  public price!: string | null

  @belongsTo(() => PractitionerResponse, {
    foreignKey: 'responseId',
  })
  public response!: BelongsTo<typeof PractitionerResponse>
}
