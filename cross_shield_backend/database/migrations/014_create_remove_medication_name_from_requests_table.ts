import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    const hasColumn = await this.schema.hasColumn('medication_requests', 'medication_name')
    if (!hasColumn) {
      return
    }
    this.schema.alterTable('medication_requests', (table) => {
      table.dropColumn('medication_name')
    })
  }

  async down() {
    const hasColumn = await this.schema.hasColumn('medication_requests', 'medication_name')
    if (hasColumn) {
      return
    }
    this.schema.alterTable('medication_requests', (table) => {
      table.string('medication_name')
    })
  }
}
