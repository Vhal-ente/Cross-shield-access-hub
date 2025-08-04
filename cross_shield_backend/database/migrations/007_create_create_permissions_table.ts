// database/migrations/XXXX_create_permissions_table.js
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable().unique()
      table.text('description').nullable()
      table.string('module', 50).notNullable() // 'users', 'adverts', 'suppliers', etc.
      table.string('action', 50).notNullable() // 'view', 'create', 'update', 'delete', 'approve'
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      // Index for faster queries
      table.index(['module', 'action'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
