import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add the new role_id column
      table.integer('role_id').unsigned().nullable().after('password')

      // Update status enum to include 'rejected'
      table
        .enum('status', ['pending', 'active', 'suspended', 'rejected'])
        .defaultTo('pending')
        .alter()

      // Add foreign key constraint
      table.foreign('role_id').references('id').inTable('roles').onDelete('SET NULL')

      // Add indexes
      table.index('role_id')
      table.index('status')
    })

    // Drop the old role enum column
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add back the old role enum
      table
        .enum('role', ['super_admin', 'health_practitioner', 'supplier', 'diaspora', 'beneficiary'])
        .notNullable()
        .after('password')

      // Drop foreign key and role_id
      table.dropForeign(['role_id'])
      table.dropColumn('role_id')

      // Revert status enum
      table.enum('status', ['active', 'pending', 'suspended']).defaultTo('pending').alter()
    })
  }
}
