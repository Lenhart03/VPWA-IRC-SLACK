import { Invite, ChannelMember, Message, Channel, User } from 'components/models'

export interface MainStateInterface {
  active_channel: Channel | null
  user: User | null
  channels: Array<Channel>
  users: Array<User>
  messages: Array<Message>
  channel_members: Array<ChannelMember>
  test_channel: Channel | null,
  invites: Array<Invite>
}

function state (): MainStateInterface {
  return {
    active_channel: null,
    user: null,
    users: [],
    channels: [],
    messages: [],
    channel_members: [],
    test_channel: null,
    invites: []
  }
}

export default state
