import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import Channel from 'App/Models/Channel'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelId: number): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where('id', channelId)
      .preload('messages', (messagesQuery) => {
        messagesQuery.preload('author').orderBy('created_at', 'desc').limit(20)
      })
      .firstOrFail()

    return channel.messages.reverse().map((message) => message.serialize() as SerializedMessage)
  }

  public async create(
    channelId: number,
    userId: number,
    content: string
  ): Promise<SerializedMessage> {
    const channel = await Channel.find(channelId)
    const message = await channel?.related('messages').create({ createdBy: userId, content })
    await message?.load('author')

    return message?.serialize() as SerializedMessage
  }
}
