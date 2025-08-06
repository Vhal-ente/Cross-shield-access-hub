import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('medication_requests', (table) => {
      table.dropColumn('medication_name')
    })
  }

  async down() {
    this.schema.alterTable('medication_requests', (table) => {
      table.string('medication_name')
    })
  }
}
