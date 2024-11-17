/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class AuthController {
  async register({ request }: HttpContextContract) {
    const data = await request.validate(RegisterUserValidator)
    const user = await User.create(data)
    return user
  }

  async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = auth.use('api').attempt(email, password)
    await token
    const user = await auth.use('api').user!
    await (user.status = 'online')
    await user.save()

    return token
  }

  async logout({ auth }: HttpContextContract) {
    const user = await auth.use('api').user!
    await (user.status = 'offline')
    await user.save()
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    await auth.user!.load('channels', (channelQuery) => {
      channelQuery.preload('members')
    })
    await auth.user!.load('invites')
    return auth.user
  }

  async setNotifyMentionsOnly({ auth, request }: HttpContextContract): Promise<boolean> {
    const data = request.all()
    const user = await auth.use('api').user!
    await (user.notifyMentionsOnly = data.value)
    await user.save()
    return data.value
  }
}
