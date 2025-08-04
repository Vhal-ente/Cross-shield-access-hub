import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email').after('phone') // Adjust position as needed
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email')
    })
  }
}
