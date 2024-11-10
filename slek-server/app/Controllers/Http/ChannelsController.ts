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
    const channel = await Channel.create(data)
    const user = await auth.use('api').authenticate()
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
}
