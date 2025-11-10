// database/migrations/xxxx_create_suppliers_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'suppliers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()

      table.string('business_name').nullable()
      table.string('specialization').nullable()
      table.string('location').nullable()
      table.text('payload').nullable() // use jsonb if Postgres
      table.enum('status', ['active', 'inactive', 'suspended']).notNullable().defaultTo('active')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
