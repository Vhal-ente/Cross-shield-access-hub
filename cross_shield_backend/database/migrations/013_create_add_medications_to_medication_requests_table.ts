import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medication_requests'

  public async up() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'medications')
    if (hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.text('medications').nullable()
    })
  }

  public async down() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'medications')
    if (!hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('medications')
    })
  }
}
