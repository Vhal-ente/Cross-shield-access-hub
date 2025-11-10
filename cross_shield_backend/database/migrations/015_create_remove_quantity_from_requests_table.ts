import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    const hasColumn = await this.schema.hasColumn('medication_requests', 'quantity')
    if (!hasColumn) {
      return
    }
    this.schema.alterTable('medication_requests', (table) => {
      table.dropColumn('quantity')
    })
  }

  async down() {
    const hasColumn = await this.schema.hasColumn('medication_requests', 'quantity')
    if (hasColumn) {
      return
    }
    this.schema.alterTable('medication_requests', (table) => {
      table.integer('quantity').notNullable()
    })
  }
}
