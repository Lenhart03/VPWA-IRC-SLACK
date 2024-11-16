import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel, { ChannelType } from 'App/Models/Channel'
import User from 'App/Models/User'
import Invite from 'App/Models/Invite'
import Ban from 'App/Models/Ban'
import Vote from 'App/Models/Vote'

export default class ChannelsController {
  public async index({ request }: HttpContextContract) {
    const userId = request.qs().user_id
    const channels = (
      await User.query()
        .where('id', userId)
        .preload('channels', (channelQuery) => {
          channelQuery.preload('members')
        })
        .firstOrFail()
    ).channels
    return channels
  }

  public async create({}: HttpContextContract) {}

  public async store({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    data.ownerId = user.id
    const channel = await Channel.create(data)
    await user.related('channels').attach([channel.id])
    return await Channel.query().where('id', channel.id).preload('members').firstOrFail()
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async invite({ auth, request, response }: HttpContextContract) {
    const data = request.all()
    const channel = await Channel.find(data.channelId)
    const user = await auth.use('api').authenticate()
    const invitedMember = await User.findBy('nickname', data.nickname)

    if (!invitedMember) {
      return response.status(403).json({ message: 'User does not exist.' })
    }

    if (data.nickname === user.nickname) {
      return response.status(403).json({ message: 'You cannot invite yourself.' })
    }

    if (channel?.type === ChannelType.PRIVATE) {
      if (channel.ownerId !== user.id) {
        return response
          .status(403)
          .json({ message: 'Only the owner can invite to a private channel' })
      }
    }

    const isMember = await channel
      ?.related('members')
      .query()
      .where('nickname', data.nickname)
      .first()
    if (isMember) {
      return response.status(400).json({ message: 'User is already a member of the channel.' })
    }

    const isInvited = await Invite.query()
      .where('channelId', data.channelId)
      .where('userId', invitedMember.id)
      .first()
    if (isInvited) {
      return response.status(400).json({ message: 'User has already been invited.' })
    }

    const isBanned = await Ban.query()
      .where('channelId', data.channelId)
      .where('userId', invitedMember.id)
      .first()
    if (isBanned) {
      if (channel?.ownerId !== user.id) {
        return response.status(403).json({ message: 'User is banned from the channel.' })
      } else {
        await isBanned.delete()
      }
    }

    const invite = await Invite.create({
      userId: (await User.findBy('nickname', data.nickname))?.id,
      channelId: data.channelId,
    })
    return invite
  }

  public async leave(httpContextContract: HttpContextContract) {
    const { auth, request } = httpContextContract
    const data = request.all()
    const user = await auth.use('api').authenticate()
    const channel = await Channel.find(data.channelId)
    if (channel?.ownerId === user.id) return this.cancel(httpContextContract)
    await user?.related('channels').detach([data.channelId])
  }

  public async accept({ auth, request, response }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()

    const banned = await Ban.query()
      .where('channel_id', data.channelId)
      .andWhere('user_id', user.id)
      .first()
    if (banned) {
      return response.status(400).json({ message: 'You are banned from the channel' })
    }

    await user?.related('channels').attach([data.channelId])
    await user?.related('invites').detach([data.channelId])

    return Channel.find(data.channelId)
  }

  public async reject({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    await user?.related('invites').detach([data.channelId])
  }

  public async cancel({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    const channel = await Channel.find(data.channelId)
    await user.related('channels').detach([data.channelId])
    if (channel?.ownerId === user.id) await channel.delete()
  }

  public async revoke({ auth, request, response }: HttpContextContract) {
    const data = request.all()
    const user = await auth.use('api').authenticate()
    const channel = await Channel.findOrFail(data.channelId)
    if (channel?.ownerId !== user.id) {
      return response.status(403).json({ message: 'Only channel owner can revoke a member.' })
    }
    const member = await User.findByOrFail('nickname', data.nickname)
    await channel.related('members').detach([member.id])
  }

  public async kick({ request, auth, response }: HttpContextContract) {
    const data = request.all()
    const voter = await auth.use('api').authenticate()
    const targetUser = await User.findByOrFail('nickname', data.nickname)
    const channel = await Channel.findOrFail(data.channelId)

    if (channel?.ownerId !== voter.id) {
      if (channel?.type === ChannelType.PRIVATE) {
        // private channel, not owner
        return response.status(403).json({ message: 'Only channel owner can kick a member.' })
      } else {
        // public channel, not owner
        await Vote.create({ channelId: channel.id, userId: targetUser.id, voterId: voter.id })
        const votes = await Vote.query()
          .where('channel_id', channel.id)
          .andWhere('user_id', targetUser.id)
        if (votes.length >= 3) {
          await Ban.create({ channelId: channel.id, userId: targetUser.id })
          await channel.related('members').detach([targetUser.id])
          votes.forEach((vote: Vote) => {
            vote.delete()
          })
        }
        return votes
      }
    }
    // owner
    await channel.related('members').detach([targetUser.id])
    await Ban.create({ channelId: channel.id, userId: targetUser.id })
  }

  public async deleteChannel({ auth, request, response }: HttpContextContract) {
    console.log('test')
    const user = await auth.use('api').authenticate()
    const channelId = request.input('channelId')
    console.log('test', channelId, user.id)

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.status(404).json({ message: 'Channel not found' })
    }
    console.log('test', channelId, channel.ownerId, user.id)

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

    // Check if user is banned
    const ban = await Ban.query()
      .where('user_id', user.id)
      .andWhere('channel_id', channel.id)
      .first()
    if (ban) {
      return response.status(403).json({ message: 'User is banned from the channel' })
    }

    // Check if the channel is public
    if (channel.type !== 'public') {
      // If the channel is not public, return a 403 error
      return response.status(403).json({ message: 'Cannot join private channels' })
    }

    // Check if the user is already a member of the channel using the `channels` relationship in User
    const isMember = await user
      .related('channels')
      .query()
      .where('channels.id', channel.id) // Specify the table for the `id` column to avoid ambiguity
      .first()

    if (isMember) {
      return response.status(400).json({ message: 'You are already a member of this channel' })
    }

    // Add the user to the channel by attaching to the `channels` relationship in User
    await user.related('channels').attach([channel.id])

    await Invite.query().where('user_id', user.id).andWhere('channel_id', channel.id).delete()

    // Return the channel details
    return response.json({
      message: `Joined channel ${channel.name} successfully`,
      channel,
    })
  }
}
