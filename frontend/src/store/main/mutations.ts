import { MutationTree } from 'vuex'
import { MainStateInterface } from './state'
import { Message, Channel, UserStatus, User, ChannelMember } from 'components/models'

const mutation: MutationTree<MainStateInterface> = {
  selectChannel (state: MainStateInterface, channel: Channel) {
    state.active_channel = channel
  },
  setUserStatus (state: MainStateInterface, status: UserStatus) {
    if (state.user) state.user.status = status

    // reset state
    // state.users = []
    // state.active_channel = null
    // state.user = null
    // state.channels = []
    // state.channel_members = []
    // state.messages = []
  },
  addUser (state: MainStateInterface, user: User) {
    state.users.push(user)
  },
  setUser (state: MainStateInterface, user: User) {
    if (user && state.user) state.user.status = UserStatus.Offline
    state.user = user
    state.active_channel = null
    // if (!user) state.user.status = UserStatus.Online
  },
  pushMessage (state: MainStateInterface, message: Message) {
    state.messages.push(message)
  },
  pushChannel (state: MainStateInterface, channel: Channel) {
    state.channels.push(channel)
  },
  addChannelMember (state: MainStateInterface, channelMember: ChannelMember) {
    state.channel_members.push(channelMember)
  },
  setTestChannel (state: MainStateInterface, channel: Channel) {
    state.test_channel = channel
  },
  leaveChannel (state: MainStateInterface, channelMember: ChannelMember) {
    if (state.active_channel?.id === channelMember.channel_id) {
      state.active_channel = null
    }
    state.channel_members.splice(state.channel_members.indexOf(channelMember), 1)
  }
}

export default mutation
