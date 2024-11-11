import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { UserStatusInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const authModule: Module<UserStatusInterface, StateInterface> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default authModule
