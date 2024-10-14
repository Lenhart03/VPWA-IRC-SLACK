import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { MainStateInterface } from './state'

const getters: GetterTree<MainStateInterface, StateInterface> = {
  getActiveChannel (state: MainStateInterface) {
    return state.active_channel
  },
  getUser (state: MainStateInterface) {
    return state.user
  },
  getUsers (state: MainStateInterface) {
    return state.users
  },
  getChannels (state: MainStateInterface) {
    return state.channels
  },
  getMessages (state: MainStateInterface) {
    return state.messages
  }
}

export default getters
