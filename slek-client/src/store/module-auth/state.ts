import { User } from 'src/contracts'

export interface AuthStateInterface {
  onlineUsers: Map<number, User>
  user: User | null,
  status: 'pending' | 'success' | 'error',
  errors: { message: string, field?: string }[],
}

function state (): AuthStateInterface {
  return {
    onlineUsers: new Map(),
    user: null,
    status: 'pending',
    errors: []
  }
}

export default state
