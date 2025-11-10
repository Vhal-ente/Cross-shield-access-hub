import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PractitionerResponseLines extends BaseSchema {
  protected tableName = 'practitioner_response_lines'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('response_id').unsigned().notNullable().index()
      table.string('med_id').notNullable()
      table.integer('available_qty').notNullable().defaultTo(0)
      table.string('brand').nullable()
      table.string('availability').notNullable().defaultTo('unavailable')
      table.decimal('price', 12, 2).nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
