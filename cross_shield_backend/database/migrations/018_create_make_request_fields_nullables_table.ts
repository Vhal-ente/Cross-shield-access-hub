import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('medication').nullable().alter()
      table.integer('quantity').nullable().alter()
      table.string('category').nullable().alter()
      table.text('description').nullable().alter()
      table.text('notes').nullable().alter()
      table.enum('urgency', ['low', 'medium', 'high']).nullable().alter()
      table.text('payload').nullable().alter()
      table.integer('assigned_to_id').unsigned().nullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('medication').notNullable().alter()
      table.integer('quantity').notNullable().alter()
      table.string('category').notNullable().alter()
      table.text('description').notNullable().alter()
      table.text('notes').notNullable().alter()
      table.enum('urgency', ['low', 'medium', 'high']).notNullable().alter()
      table.text('payload').notNullable().alter()
      table.integer('assigned_to_id').unsigned().notNullable().alter()
    })
  }
}
