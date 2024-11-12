import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: ChannelType

  @column()
  public ownerId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  public messages: HasMany<typeof Message>

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  public author: BelongsTo<typeof User>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotTimestamps: true,
  })
  public channels: ManyToMany<typeof Channel>
}
