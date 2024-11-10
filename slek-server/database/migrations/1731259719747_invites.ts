import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Invites extends BaseSchema {
  protected tableName = 'invites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable('invites')
  }
}
