import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ReplacePrescriptionImageWithArray extends BaseSchema {
  protected tableName = 'medication_requests'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('prescription_image')
      table.json('prescription_images').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('prescription_image', 255).nullable()
      table.dropColumn('prescription_images')
    })
  }
}
