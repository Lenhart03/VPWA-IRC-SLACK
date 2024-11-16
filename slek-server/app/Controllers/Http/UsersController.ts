import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'

export default class UsersController {
  public async updateStatus({ socket, auth }: WsContextContract, status: string) {
    try {
      const user = await auth.authenticate()

      if (!status) {
        socket.emit('status-update-failed', { message: 'Status is required' })
        return
      }

      user.status = status as 'online' | 'offline' | 'dnd'
      await user.save()

      // Notify all clients except the sender about the status change
      socket.broadcast.emit('statusChanged', { userId: user.id, status })

      // Confirm the update to the sender
      socket.emit('status-updated', { status: 'success', message: 'Status updated successfully' })
    } catch (error) {
      console.error('Error updating status:', error)
      socket.emit('status-update-failed', { message: 'Failed to update status' })
    }
  }

  public async getStatus({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    return user.status
  }
}
