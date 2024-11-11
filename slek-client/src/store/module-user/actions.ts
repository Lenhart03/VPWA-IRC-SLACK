import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { UserStatusInterface } from './state'
import StatusService from 'src/services/UserStatusService'

const actions: ActionTree<UserStatusInterface, StateInterface> = {
  async updateStatus ({ commit }, status: 'online' | 'offline' | 'dnd') {
    try {
      // Call StatusService and get the updated status
      const updatedStatus = await StatusService.updateStatus(status)
      // Commit the new status to the Vuex store
      commit('SET_USER_STATUS', updatedStatus)
    } catch (error) {
      console.error('Error in updating status:', error)
    }
  },

  async fetchStatus ({ commit }) {
    try {
      const status = await StatusService.fetchStatus()
      commit('SET_USER_STATUS', status) // Commit the fetched status
    } catch (error) {
      console.error('Error in fetching status:', error)
    }
  }
}

export default actions
