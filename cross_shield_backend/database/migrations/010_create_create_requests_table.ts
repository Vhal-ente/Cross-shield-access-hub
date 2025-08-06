// database/migrations/xxxx_create_requests_table.js
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('type', 100).notNullable()
      table.integer('requested_by_id').unsigned().notNullable()
      table.string('medication', 255).notNullable()
      table.integer('quantity').notNullable()
      table.enum('status', ['pending', 'in_progress', 'fulfilled', 'rejected']).defaultTo('pending')
      table.integer('assigned_to_id').unsigned().nullable()
      table.text('description').nullable()
      table.enum('urgency', ['low', 'medium', 'high']).defaultTo('medium')
      table.text('notes').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      // Foreign keys
      table.foreign('requested_by_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('assigned_to_id').references('id').inTable('users').onDelete('SET NULL')

      // Indexes
      table.index('status')
      table.index('requested_by_id')
      table.index('assigned_to_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
