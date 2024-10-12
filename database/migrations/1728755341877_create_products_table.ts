import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.decimal('price').notNullable()
      table.string('type').notNullable()
      table.string('description').notNullable()
      table.string('image_path').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
