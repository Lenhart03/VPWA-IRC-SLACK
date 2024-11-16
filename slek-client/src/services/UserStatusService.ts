import { api } from 'src/boot/axios'
import { SocketManager } from './SocketManager'

class ChannelSocketManager extends SocketManager {
  public subscribe (): void {
    this.socket.on('statusChanged', (data) => {
      console.log('Status Changed:', data)
    })
  }

  public changeStatus (status: string): Promise<unknown> {
    return this.emitAsync('statusChange', status)
  }
}

class StatusService {
  private channelSocketManager: ChannelSocketManager | undefined

  // Updates the user's status in the backend
  public async updateStatus (status: string): Promise<void> {
    if (!this.channelSocketManager) {
      this.channelSocketManager = new ChannelSocketManager('status')
      this.channelSocketManager.subscribe()
    }
    try {
      // Make an API call to update the status
      await this.channelSocketManager.changeStatus('online')
      console.log('Status successfully updated:', status)
    } catch (error) {
      console.error('Failed to update status:', error)
      throw error // Re-throw error if you want to handle it in the caller
    }
  }

  // Retrieves the current user status from the backend (if needed)
  public async fetchStatus (): Promise<string> {
    try {
      const response = await api.get('user/status')
      return response.data.status // Assumes the response contains a 'status' field
    } catch (error) {
      console.error('Failed to fetch status:', error)
      throw error
    }
  }
}

export default new StatusService()
