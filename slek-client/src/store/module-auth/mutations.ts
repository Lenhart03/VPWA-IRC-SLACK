import { User } from 'src/contracts'
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
    state.onlineUsers = onlineUsers
  },
  ADD_ONLINE_USER (state, user) {
    state.onlineUsers.push(user)
  },
  REMOVE_ONLINE_USER (state, user) {
    if (!user) return
    state.onlineUsers.splice(state.onlineUsers.findIndex((onlineUser) => onlineUser.id === user.id))
  }
}

export default mutation
