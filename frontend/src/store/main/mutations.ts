import { MutationTree } from 'vuex'
import { MainStateInterface } from './state'
import { Channel, UserStatus, User } from 'components/models'

const mutation: MutationTree<MainStateInterface> = {
  selectChannel (state: MainStateInterface, channel: Channel) {
    state.active_channel = channel
  },
  setUserStatus (state: MainStateInterface, status: UserStatus) {
    if (state.user) state.user.status = status
  },
  addUser (state: MainStateInterface, user: User) {
    state.users.push(user)
  },
  setUser (state: MainStateInterface, user: User) {
    state.user = user
  }
}

export default mutation
