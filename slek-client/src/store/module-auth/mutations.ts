import { SerializedMessage, User } from 'src/contracts'
import { MutationTree } from 'vuex'
import { AuthStateInterface } from './state'

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START (state) {
    state.status = 'pending'
    state.errors = []
  },
  AUTH_SUCCESS (state, user: User | null) {
    state.status = 'success'
    state.user = user
  },
  AUTH_ERROR (state, errors) {
    state.status = 'error'
    state.errors = errors
  },
  SET_USER_STATUS (state, status) {
    if (!state.user) return
    state.user.status = status
  },
  SET_ONLINE_USERS (state, onlineUsers) {
    state.onlineUsers = new Map()
    onlineUsers.forEach((user: User) => state.onlineUsers.set(user.id, user))
  },
  SET_ONLINE_USER (state, user) {
    state.onlineUsers.set(user.id, user)
  },
  REMOVE_ONLINE_USER (state, user) {
    if (!user) return
    state.onlineUsers.delete(user.id)
  },
  SET_NOTIFY_MENTIONS_ONLY (state, value: boolean) {
    if (!state.user) return
    state.user.notify_mentions_only = value
  },
  SET_LIVE_MESSAGE (state, message: SerializedMessage) {
    state.liveMessages.set(message.created_by, message)
    console.warn(state.liveMessages)
  },
  REMOVE_LIVE_MESSAGE (state, message: SerializedMessage) {
    if (message.created_by === state.displayMessageIndex) state.displayMessageIndex = -1
    state.liveMessages.delete(message.created_by)
  },
  SET_DISPLAY_MESSAGE_INDEX (state, index: number) {
    state.displayMessageIndex = index
  }
}

export default mutation
