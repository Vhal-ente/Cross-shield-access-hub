import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'email')
    if (hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email').after('phone') // Adjust position as needed
    })
  }

  public async down() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'email')
    if (!hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email')
    })
  }
}
