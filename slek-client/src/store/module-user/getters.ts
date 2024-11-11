import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UserStatusInterface } from './state'

const getters: GetterTree<UserStatusInterface, StateInterface> = {
  user: (state) => state.user,
  userStatus: (state) => state.user ? state.user.status : 'offline' // Fallback to 'offline' if user is null
}

export default getters
