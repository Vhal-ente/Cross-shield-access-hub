import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'referred')
    if (hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('referred').notNullable().defaultTo(false)
      table.text('referral_note').nullable()
      table.timestamp('referred_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'referred')
    if (!hasColumn) {
      return
    }
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('referred')
      table.dropColumn('referral_note')
      table.dropColumn('referred_at')
    })
  }
}
