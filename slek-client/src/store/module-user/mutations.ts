import { MutationTree } from 'vuex'
import { UserStatusInterface } from './state'

const mutation: MutationTree<UserStatusInterface> = {
  SET_STATUS (state, newStatus) {
    state.status = newStatus
  }
}

export default mutation
