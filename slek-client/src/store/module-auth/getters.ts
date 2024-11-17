import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  isAuthenticated (context) {
    return context.user !== null
  },
  user (context) {
    return context.user
  },
  onlineUsers (context) {
    return context.onlineUsers
  },
  notifyMentionsOnly (context) {
    return context.user?.notify_mentions_only
  }
}

export default getters
