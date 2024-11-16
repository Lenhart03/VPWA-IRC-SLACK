import { User } from 'src/contracts'

export interface AuthStateInterface {
  onlineUsers: User[]
  user: User | null,
  status: 'pending' | 'success' | 'error',
  errors: { message: string, field?: string }[]
}

function state (): AuthStateInterface {
  return {
    onlineUsers: [],
    user: null,
    status: 'pending',
    errors: []
  }
}

export default state
