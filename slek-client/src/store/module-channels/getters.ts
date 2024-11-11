import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels (context) {
    return context.channels
  },
  currentMessages (context) {
    return context.active !== null ? context.messages[context.active.id] : []
  },
  lastMessageOf (context) {
    return (channelId: number) => {
      const messages = context.messages[channelId]
      return messages.length > 0 ? messages[messages.length - 1] : null
    }
  },
  invites (context) {
    return context.invites
  },
  messages: (state) => (channelId: number) => state.messages[channelId] || []
}

export default getters
