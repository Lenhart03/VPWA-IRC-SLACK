import { MutationTree } from 'vuex'
import { MainStateInterface } from './state'
import { Message, Channel, UserStatus, User } from 'components/models'

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
  },
  pushMessage (state: MainStateInterface, message: Message) {
    state.messages.push(message)
  }
}

export default mutation
