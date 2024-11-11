import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { UserStatusInterface } from './state'
import StatusService from 'src/services/UserStatusService'

const actions: ActionTree<UserStatusInterface, StateInterface> = {
  async updateStatus ({ commit }, status) {
    try {
      await StatusService.updateStatus(status, commit) // Call StatusService to handle API and commit
    } catch (error) {
      console.error('Error in updating status:', error)
    }
  },

  async fetchStatus ({ commit }) {
    try {
      const status = await StatusService.fetchStatus()
      commit('SET_STATUS', status)
    } catch (error) {
      console.error('Error in fetching status:', error)
    }
  }
}

export default actions
