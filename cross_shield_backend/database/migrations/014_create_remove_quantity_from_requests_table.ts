import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('medication_requests', (table) => {
      table.dropColumn('quantity')
    })
  }

  async down() {
    this.schema.alterTable('medication_requests', (table) => {
      table.integer('quantity').notNullable()
    })
  }
}
