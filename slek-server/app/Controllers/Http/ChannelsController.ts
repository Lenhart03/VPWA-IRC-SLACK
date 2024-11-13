import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import Invite from 'App/Models/Invite'

export default class ChannelsController {
  public async index({ request }: HttpContextContract) {
    const userId = request.qs().user_id
    const channels = (await User.query().where('id', userId).preload('channels').first())?.channels
    return channels
  }

  public async create({}: HttpContextContract) {}

  public async store({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    data.ownerId = user.id
    const channel = await Channel.create(data)
    await user.related('channels').attach([channel.id])
    return channel
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async invite({ request }: HttpContextContract) {
    const data = request.all()
    const invite = await Invite.create({
      userId: (await User.findBy('nickname', data.nickname))?.id,
      channelId: data.channelId,
    })
    return invite
  }

  public async leave({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    await user?.related('channels').detach([data.channelId])
  }

  public async accept({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    await user?.related('channels').attach([data.channelId])
    await user?.related('invites').detach([data.channelId])
    return Channel.find(data.channelId)
  }

  public async reject({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    await user?.related('invites').detach([data.channelId])
  }

  public async deleteChannel({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
    const channelId = request.input('channelId')

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.status(404).json({ message: 'Channel not found' })
    }

    // Check if the user is the owner of the channel
    if (channel.ownerId !== user.id) {
      return response.status(403).json({ message: 'Only the owner can delete this channel' })
    }

    await channel.delete()
    return response.json({ message: `Channel ${channel.name} deleted successfully` })
  }

  public async join({ auth, request, response }: HttpContextContract) {
    const { channelName } = request.only(['channelName'])
    const user = await auth.use('api').authenticate()

    // Find the channel by name
    const channel = await Channel.query().where('name', channelName).first()

    if (!channel) {
      // If the channel doesn't exist, return a 404 error
      return response.status(404).json({ message: 'Channel not found' })
    }

    // Check if the channel is public
    if (channel.type !== 'public') {
      // If the channel is not public, return a 403 error
      return response.status(403).json({ message: 'Cannot join private channels' })
    }

    // Check if the user is already a member of the channel using the `channels` relationship in User
    const isMember = await user.related('channels')
      .query()
      .where('channels.id', channel.id) // Specify the table for the `id` column to avoid ambiguity
      .first()
    
    if (isMember) {
      return response.status(400).json({ message: 'You are already a member of this channel' })
    }

    // Add the user to the channel by attaching to the `channels` relationship in User
    await user.related('channels').attach([channel.id])

    // Return the channel details
    return response.json({
      message: `Joined channel ${channel.name} successfully`,
      channel
    })
  }
}
