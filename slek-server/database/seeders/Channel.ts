import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Channel, { ChannelType } from 'App/Models/Channel'
import User from 'App/Models/User'

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
  }
}
