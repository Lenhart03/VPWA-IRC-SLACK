import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { MainStateInterface } from './state'
import { Invite } from 'src/components/models'

const getters: GetterTree<MainStateInterface, StateInterface> = {
  getActiveChannel (state: MainStateInterface) {
    return state.active_channel
  },
  getUser (state: MainStateInterface) {
    console.log(state)
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
  },
  getState (state: MainStateInterface) {
    return state
  },
  getChannelMembers (state: MainStateInterface) {
    return state.channel_members
  },
  myInvites (state: MainStateInterface) {
    if (!state.user) return
    const myInvites: Array<Invite> = []
    for (const invite of state.invites) {
      if (invite.target_id === state.user.id) {
        myInvites.push(invite)
      }
    }
    return myInvites
  }
}

export default getters
