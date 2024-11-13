import { SerializedMessage, Channel } from 'src/contracts'
import { MutationTree } from 'vuex'
import { ChannelsStateInterface } from './state'
import { useStore } from 'src/store/index'

const mutation: MutationTree<ChannelsStateInterface> = {
  INIT_LOAD_CHANNELS (state) {
    const store = useStore()
    state.channels = store.getters['auth/user'].channels
    state.invites = store.getters['auth/user'].invites
  },
  LOADING_START (state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS (state, { channelId, messages }: { channelId: number, messages: SerializedMessage[] }) {
    state.loading = false
    state.messages[channelId] = messages
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL (state, channelId) {
    state.active = null
    delete state.messages[channelId]
  },
  SET_ACTIVE (state, channel: Channel) {
    state.active = channel
  },
  NEW_MESSAGE (state, { channelId, message }: { channelId: number, message: SerializedMessage }) {
    state.messages[channelId].push(message)
  },
  async ADD_CHANNEL (state, channel) {
    state.channels.push(channel)
    state.messages[channel.id] = []
  },
  REMOVE_CHANNEL (state, channelId) {
    if (state.active?.id === channelId) { state.active = null }
    state.channels = state.channels.filter(channel => channel.id !== channelId)
    delete state.messages[channelId]
  },
  REJECT_INVITE (state, channelId) {
    state.invites = state.invites.filter(invite => invite.id !== channelId)
  },
  REMOVE_INVITE (state, channelId) {
    state.invites = state.invites.filter(invite => invite.id !== channelId)
  },
  SET_MESSAGES (state, { channelId, messages }) {
    state.messages[channelId] = messages
  },
  ADD_MESSAGES (state, { channelId, messages }) {
    if (!state.messages[channelId]) {
      state.messages[channelId] = []
    }
    state.messages[channelId] = [...messages, ...state.messages[channelId]]
  },
  SET_CHANNELS (state, channels) {
    state.channels = channels
  },
  DELETE_CHANNEL (state, channelId: number) {
    state.channels = state.channels.filter(channel => channel.id !== channelId)
  },
  SET_PAGINATION (state, { channelId, pagination }) {
    state.pagination[channelId] = pagination
  }
}

export default mutation
