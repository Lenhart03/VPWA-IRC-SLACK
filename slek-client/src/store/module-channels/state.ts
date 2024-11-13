import { SerializedMessage, Channel } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean,
  error: Error | null,
  messages: { [channel: number]: SerializedMessage[] }
  active: Channel | null
  channels: Channel[]
  invites: Channel[]
  pagination: { [channelId: number]: {
      page: number,
      hasMore: boolean}
  }
  ownerId: number
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: [],
    invites: [],
    pagination: {}, // Track the pagination status of each channel
    ownerId: 0
  }
}

export default state
