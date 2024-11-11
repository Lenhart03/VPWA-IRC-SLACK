import { User } from 'src/contracts'

export interface UserStatusInterface {
user: User | null,
status: 'online' | 'offline' | 'dnd',
errors: { message: string, field?: string }[]
}

function state (): UserStatusInterface {
  return {
    user: null,
    status: 'offline',
    errors: []
  }
}

export default state
