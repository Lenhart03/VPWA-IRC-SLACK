import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Channel, { ChannelType } from 'App/Models/Channel'
import Message from 'App/Models/Message'
import { DateTime } from 'luxon'

export default class ChannelSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Channel.updateOrCreateMany(uniqueKey, [
      {
        name: 'general',
        type: ChannelType.PUBLIC,
      },
      {
        name: 'public example',
        type: ChannelType.PUBLIC,
      },
      {
        name: 'private example',
        type: ChannelType.PRIVATE,
      },
    ])

    const channels = await Channel.all()
    channels.forEach(async (channel: Channel) => {
      await Message.create({
        content: 'Welcome to the new channel!',
        channelId: channel.id,
        createdAt: DateTime.local(),
      })
    })
  }
}
