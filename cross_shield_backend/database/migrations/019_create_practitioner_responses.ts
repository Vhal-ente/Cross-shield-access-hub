import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PractitionerResponses extends BaseSchema {
  protected tableName = 'practitioner_responses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('practitioner_id').unsigned().notNullable().index()
      table.string('request_id').notNullable().index()
      table.string('provider_id').nullable()
      table.json('lines').nullable() // keep JSON for quick access
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
