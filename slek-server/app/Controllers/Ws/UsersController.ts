import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from 'App/Models/Message'

export default class UsersController {
  public async updateStatus({ socket, auth }: WsContextContract, status: string) {
    console.log('updateStatus')
    try {
      const user = await auth.authenticate()
      await (user.status = status as 'online' | 'offline' | 'dnd')
      await user.save()
      socket.broadcast.emit('user:' + status, user)
      return status
    } catch (error) {
      console.error('Error updating status:', error)
      socket.emit('error', { message: 'Unable to update status' })
    }
  }

  public async messageChange({ socket, auth }: WsContextContract, message: Message) {
    const user = await auth.authenticate()
    message.createdBy = user.id
    console.log(
      'messageChange',
      'message change for user ' +
        user.nickname +
        ' in channel ' +
        message.channelId +
        ' message = ' +
        message.content
    )
    try {
      socket.broadcast.emit('messageChangeBroadcast', {
        content: message.content,
        channel_id: message.channelId,
        created_by: message.createdBy,
      })
      return (
        'message change for user ' +
        user.nickname +
        ' in channel ' +
        message.channelId +
        ' message = ' +
        message.content
      )
    } catch (error) {
      console.error('Error updating status:', error)
      socket.emit('error', { message: 'Unable to update status' })
    }
  }
}
