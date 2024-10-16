import { MutationTree } from 'vuex'
import { MainStateInterface } from './state'
import { Invite, Message, Channel, UserStatus, User, ChannelMember } from 'components/models'

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
  },
  invite (state: MainStateInterface, username: string) {
    if (!state.user || !state.active_channel) return
    for (const user of state.users) {
      if (user.username === username) {
        const invite: Invite = {
          channel_id: state.active_channel.id,
          source_id: state.user.id,
          target_id: user.id
        }
        state.invites.push(invite)
      }
    }
  },
  acceptInvite (state: MainStateInterface, channelId: number) {
    if (!state.user) return
    for (let i = 0; i < state.invites.length; i++) {
      const invite: Invite = state.invites[i]
      if (invite.channel_id === channelId && invite.target_id === state.user.id) {
        state.invites.splice(i, 1)
        const channelMember: ChannelMember = {
          channel_id: invite.channel_id,
          user_id: invite.target_id
        }
        state.channel_members.push(channelMember)
        return
      }
    }
  },
  rejectInvite (state: MainStateInterface, channelId: number) {
    if (!state.user) return
    for (let i = 0; i < state.invites.length; i++) {
      const invite: Invite = state.invites[i]
      if (invite.channel_id === channelId && invite.target_id === state.user.id) {
        state.invites.splice(i, 1)
        return
      }
    }
  }
}

export default mutation
