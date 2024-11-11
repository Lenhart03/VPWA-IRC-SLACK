import { MutationTree } from 'vuex'
import { UserStatusInterface } from './state'

const mutations: MutationTree<UserStatusInterface> = {
  SET_USER_STATUS (state, status: 'online' | 'offline' | 'dnd') {
    if (state.user) {
      state.user.status = status // Update status in user object
    }
  },
  SET_USER (state, user) {
    state.user = user // Set user object
  }
}

export default mutations
