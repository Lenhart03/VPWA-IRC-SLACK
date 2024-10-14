import { Channel, User, UserStatus, ChannelType } from 'components/models'

export interface MainStateInterface {
  active_channel: Channel | null
  user: User | null
  channels: Array<Channel>
  users: Array<User>
}

function state (): MainStateInterface {
  const exampleUser = {
    id: 1,
    username: 'example_user',
    firstname: 'Example',
    lastname: 'User',
    email: 'example@user.com',
    password: 'example',
    status: UserStatus.Online
  }
  const otherUser = {
    id: 1,
    username: 'other_user',
    firstname: 'Other',
    lastname: 'User',
    email: 'other@user.com',
    password: 'other',
    status: UserStatus.Online
  }
  const examplePublicChannel = {
    id: 1,
    name: 'Example Public',
    type: ChannelType.Public
  }
  const examplePrivateChannel = {
    id: 2,
    name: 'Example Private',
    type: ChannelType.Private
  }

  return {
    active_channel: null,
    user: null,
    users: [exampleUser, otherUser],
    channels: [examplePublicChannel, examplePrivateChannel]
  }
}

export default state
