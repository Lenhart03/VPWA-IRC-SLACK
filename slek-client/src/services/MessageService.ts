import { api } from 'src/boot/axios'
import { Commit } from 'vuex'
import { BootParams, SocketManager } from './SocketManager'
import { SerializedMessage } from 'src/contracts'

class MessageSocketManager extends SocketManager {
  // Method to subscribe to events
  public subscribe ({ store }: BootParams): void {
    this.socket.on('connect_error', (err) => {
      console.error(`[connect_error]: ${err.message}`, err)
    })

    this.socket.on('messageChangeBroadcast', (message: SerializedMessage) => {
      if (message.content) store.commit('auth/SET_LIVE_MESSAGE', message)
      else store.commit('auth/REMOVE_LIVE_MESSAGE', message)
    })

    // Ensure socket connects
    this.socket.connect()
  }

  // Method to emit status change event
  public async messageChange (content: string, channelId: number): Promise<string> {
    try {
      const promise: Promise<string> = this.emitAsync('messageChange', { content, channelId })
      return promise
    } catch (error) {
      console.error('Failed to emit message change:', error)
      throw error
    }
  }
}

class MessageService {
  // eslint-disable-next-line no-use-before-define
  private static instance: MessageService
  private messageSocketManager: MessageSocketManager

  private constructor () {
    this.messageSocketManager = new MessageSocketManager('/messageChange')
  }

  // Singleton implementation
  public static getInstance (): MessageService {
    if (!this.instance) {
      this.instance = new MessageService()
    }
    return this.instance
  }

  // Load paginated messages for a channel
  public async loadMessages (channelId: number, page: number, commit: Commit): Promise<SerializedMessage[]> {
    try {
      const response = await api.get(`/channels/${channelId}/messages`, {
        params: { page }
      })

      const messages = response.data
      commit('channels/ADD_MESSAGES', { channelId, messages }) // Commits messages to the Vuex store
      return messages
    } catch (error) {
      console.error('Failed to load messages:', error)
      throw error
    }
  }

  public async messageChange (message: string, channelId: number): Promise<string> {
    try {
      const updatedStatus = this.messageSocketManager.messageChange(message, channelId)
      return updatedStatus
    } catch (error) {
      console.error('Failed to message change:', error)
      throw error
    }
  }
}

export default MessageService.getInstance()
