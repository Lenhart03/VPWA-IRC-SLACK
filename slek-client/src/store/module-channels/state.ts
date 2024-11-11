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
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: [],
    invites: [],
    pagination: {} // Track the pagination status of each channel
  }
}

export default state
