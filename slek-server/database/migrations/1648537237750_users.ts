import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('firstname', 32).notNullable()
      table.string('lastname', 32).notNullable()
      table.string('nickname', 32).notNullable().unique()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.enum('status', ['online', 'offline', 'dnd']).defaultTo('offline').notNullable()
      table.boolean('notify_mentions_only').defaultTo(false).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
