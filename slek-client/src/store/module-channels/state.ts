import { SerializedMessage, Channel } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean,
  error: Error | null,
  messages: { [channel: number]: SerializedMessage[] }
  active: Channel | null
  channels: Channel[]
  invites: Channel[]
}

function state (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: [],
    invites: []
  }
}

export default state
