import { User } from 'src/contracts'
import { authManager } from '.'
import { BootParams, SocketManager } from './SocketManager'

class ActivitySocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      console.log('Online users list', onlineUsers)
      store.commit('auth/SET_ONLINE_USERS', onlineUsers)
    })

    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user)
      store.commit('auth/SET_ONLINE_USER', user)
    })

    this.socket.on('user:dnd', (user: User) => {
      store.commit('auth/SET_ONLINE_USER', user)
    })

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user)
      store.commit('auth/REMOVE_ONLINE_USER', user)
    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }
}

export default new ActivitySocketManager('/')
