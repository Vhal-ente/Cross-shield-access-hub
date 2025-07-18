import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'medication_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('beneficiary_id').unsigned().references('id').inTable('users').nullable()
      table.string('medication_name', 255).notNullable()
      table.integer('quantity').notNullable()
      table.enum('urgency', ['normal', 'urgent', 'emergency']).defaultTo('normal')
      table.text('medical_condition').nullable()
      table.text('notes').nullable()
      table.string('prescription_image', 255).nullable()
      table.enum('status', ['pending', 'in_progress', 'fulfilled', 'cancelled']).defaultTo('pending')
      table.integer('assigned_to').unsigned().references('id').inTable('users').nullable()
      table.decimal('price', 10, 2).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}