import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('full_name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('phone', 20).notNullable()
      table.string('password', 180).notNullable()
      table.enum('role', ['super_admin', 'health_practitioner', 'supplier', 'diaspora', 'beneficiary']).notNullable()
      table.enum('status', ['active', 'pending', 'suspended']).defaultTo('pending')
      table.string('location', 255).nullable()
      table.string('license_number', 100).nullable() // For health practitioners
      table.string('business_name', 255).nullable() // For suppliers
      table.string('remember_me_token').nullable()
      table.timestamp('email_verified_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}