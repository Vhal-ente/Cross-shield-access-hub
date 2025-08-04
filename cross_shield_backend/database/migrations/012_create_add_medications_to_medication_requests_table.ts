import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medication_requests'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('medications').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('medications')
    })
  }
}
