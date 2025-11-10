import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import HealthPractitioner from '#models/health_practitioner'
import PractitionerResponseLine from '#models/practitioner_response_line'

export default class PractitionerResponse extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public practitionerId!: number

  @column()
  public requestId!: string

  @column()
  public providerId!: string | null

  // raw JSON column (optional)
  @column()
  public lines: any

  @belongsTo(() => HealthPractitioner, {
    foreignKey: 'practitionerId',
  })
  public practitioner!: BelongsTo<typeof HealthPractitioner>

  @hasMany(() => PractitionerResponseLine, {
    foreignKey: 'responseId',
  })
  public linesList!: HasMany<typeof PractitionerResponseLine>
}
