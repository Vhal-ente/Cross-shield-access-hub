import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    const exists = await this.schema.hasTable(this.tableName)
    if (exists) return
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('supplier_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('suppliers')
        .onDelete('CASCADE')

      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('quantity').unsigned().notNullable()
      table.date('expiry_date').notNullable()
      table.string('nafdac_number', 100).nullable()
      table.string('image_url', 255).nullable()
      table.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['supplier_id'])
      table.index(['status'])
    })
  }

  public async down() {
    const exists = await this.schema.hasTable(this.tableName)
    if (!exists) return
    this.schema.dropTable(this.tableName)
  }
}
