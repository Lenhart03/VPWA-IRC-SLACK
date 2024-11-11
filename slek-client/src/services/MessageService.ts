import { api } from 'src/boot/axios'
import { Commit } from 'vuex'
import { SerializedMessage } from 'src/contracts'

class MessageService {
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
}

export default new MessageService()
