import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'

export default class UsersController {
  public async updateStatus({ socket, auth }: WsContextContract, status: string) {
    console.log('updateStatus')
    try {
      // TODO: update database and emit
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
}
