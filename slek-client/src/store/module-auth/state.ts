import { SerializedMessage, User } from 'src/contracts'

export interface AuthStateInterface {
  liveMessages: Map<number, SerializedMessage>
  onlineUsers: Map<number, User>
  user: User | null,
  status: 'pending' | 'success' | 'error',
  errors: { message: string, field?: string }[],
  displayMessageIndex: number
}

function state (): AuthStateInterface {
  return {
    liveMessages: new Map(),
    onlineUsers: new Map(),
    user: null,
    status: 'pending',
    errors: [],
    displayMessageIndex: -1
  }
}

export default state
