import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Referrals extends BaseSchema {
  protected tableName = 'referrals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.string('referred_name').notNullable()
      table.string('referred_phone').notNullable()
      table.string('referred_email').nullable()
      table.string('referred_address').nullable()
      table
        .enum('referral_type', ['health_practitioner', 'supplier', 'diaspora', 'beneficiary'])
        .notNullable()
      table.json('metadata').nullable() // optional: medication info or notes
      table.enum('status', ['pending', 'processed', 'paid']).defaultTo('pending')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
