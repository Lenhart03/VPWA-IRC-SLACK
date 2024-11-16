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
  }
}

export default getters
