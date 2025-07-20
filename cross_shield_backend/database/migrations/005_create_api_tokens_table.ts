import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_tokens'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)
    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')

        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
        table.string('name')
        table.string('type')
        table.string('token', 64).notNullable().unique()
        table.string('ip_address', 255).nullable()
        table.timestamp('expires_at', { useTz: true }).nullable()
        table.timestamp('created_at', { useTz: true }).notNullable()
      })
    }
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
