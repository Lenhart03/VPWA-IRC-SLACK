import { RawMessage, SerializedMessage, Channel, ChannelData } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'
import { api } from 'src/boot/axios'
import { Store, Commit } from 'vuex'

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channelId = this.namespace.split('/').pop() as number | undefined

    this.socket.on('message', (message: SerializedMessage) => {
      store.commit('channels/NEW_MESSAGE', { channelId, message })
    })
  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages')
  }
}

class ChannelService {
  private channels: Map<number, ChannelSocketManager> = new Map()

  public join (id: number): ChannelSocketManager {
    if (this.channels.has(id)) {
      throw new Error(`User is already joined in channel id="${id}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${id}`)
    this.channels.set(id, channel)
    return channel
  }

  public async joinChannelByName (channelName: string): Promise<Channel> {
    try {
      // Make an API call to attempt joining the channel
      const response = await api.post('/channels/join', { channelName })
      const channel = response.data

      if (!channel.isPublic) {
        throw new Error('Cannot join private channels directly')
      }

      console.log('Joined channel successfully:', channel.name)
      return channel
    } catch (error) {
      console.error('Failed to join channel:', error)
      throw error
    }
  }

  public leave (name: number): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (id: number): ChannelSocketManager | undefined {
    return this.channels.get(id)
  }

  public async create (data: ChannelData, commit: Commit): Promise<Channel> {
    const response = await api.post<Channel>('channel', data)
    const channel = response.data
    commit('ADD_CHANNEL', channel)
    return channel
  }

  public async getJoinedChannels (userId: number): Promise<Channel[]> {
    const response = await api.get<Channel[]>('channel?user_id=' + userId)
    return response.data
  }

  public async inviteUserToChannel (nickname: string, channelId: number | undefined) {
    if (!nickname || !channelId) return
    await api.post('invite', { nickname, channelId })
  }

  public async leaveChannel (channelId: number | undefined, store: Store<unknown>) {
    if (!channelId) return
    await api.post('leave', { channelId })
    this.leave(channelId)
    store.commit('channels/REMOVE_CHANNEL', channelId)
  }

  public async acceptInvite (channelId: number | undefined, store: Store<unknown>) {
    const channel = (await api.post('accept', { channelId })).data
    store.dispatch('channels/join', channelId)
    store.commit('channels/ADD_CHANNEL', channel)
    store.commit('channels/SET_ACTIVE', channel)
    store.commit('channels/REMOVE_INVITE', channelId)
  }

  public async rejectInvite (channelId: number | undefined, store: Store<unknown>) {
    await api.post('reject', { channelId })
    store.commit('channels/REJECT_INVITE', channelId)
  }
}

export default new ChannelService()
