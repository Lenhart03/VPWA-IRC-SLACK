import { User } from 'src/contracts'
import { api } from 'src/boot/axios'
import { BootParams, SocketManager } from './SocketManager'

class StatusSocketManager extends SocketManager {
  // Method to subscribe to events
  public subscribe ({ store }: BootParams): void {
    // Subscribe to the 'statusChanged' event from the server
    this.socket.on('connect_error', (err) => {
      console.error(`[connect_error]: ${err.message}`, err)
    })

    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user)
      store.commit('auth/SET_ONLINE_USER', user)
    })

    this.socket.on('user:dnd', (user: User) => {
      store.commit('auth/SET_ONLINE_USER', user)
    })

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user)
      store.commit('auth/REMOVE_ONLINE_USER', user)
    })

    // this.socket.on('statusChanged', (data) => {
    //  console.log('Status Changed:', data)
    // })

    // Ensure socket connects
    this.socket.connect()
  }

  // Method to emit status change event
  public async changeStatus (status: string): Promise<string> {
    try {
      const promise: Promise<string> = this.emitAsync('statusChange', status)
      console.log('Status change emitted successfully:', status)
      return promise
    } catch (error) {
      console.error('Failed to emit status change:', error)
      throw error
    }
  }
}

class StatusService {
  // eslint-disable-next-line no-use-before-define
  private static instance: StatusService
  private statusSocketManager: StatusSocketManager

  private constructor () {
    this.statusSocketManager = new StatusSocketManager('/status')
  }

  // Singleton implementation
  public static getInstance (): StatusService {
    if (!this.instance) {
      this.instance = new StatusService()
    }
    return this.instance
  }

  // Updates the user's status via WebSocket
  public async updateStatus (status: string): Promise<string> {
    try {
      const updatedStatus = this.statusSocketManager.changeStatus(status)
      console.log('Status successfully updated:', updatedStatus)
      return updatedStatus
    } catch (error) {
      console.error('Failed to update status:', error)
      throw error
    }
  }

  // Retrieves the current user status from the API
  public async fetchStatus (): Promise<string> {
    try {
      const response = await api.get('user/status')
      console.log('Fetched status:', response.data.status)
      return response.data.status
    } catch (error) {
      console.error('Failed to fetch status:', error)
      throw error
    }
  }
}

export default StatusService.getInstance()
