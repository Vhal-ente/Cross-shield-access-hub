import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'payload')
    if (hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.json('payload').nullable()
    })
  }

  public async down() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'payload')
    if (!hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payload')
    })
  }
}
