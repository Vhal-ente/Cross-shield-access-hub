import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('diaspora_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.string('phone', 20).notNullable()
      table.string('location', 255).notNullable()
      table.text('medication_needs').nullable()
      table.enum('status', ['active', 'inactive']).defaultTo('active')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}