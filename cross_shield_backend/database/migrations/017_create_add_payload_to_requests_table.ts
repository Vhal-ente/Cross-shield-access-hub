import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('payload').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payload')
    })
  }
}
