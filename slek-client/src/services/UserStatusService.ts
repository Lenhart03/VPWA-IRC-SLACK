import { api } from 'src/boot/axios'
import { Commit } from 'vuex'

class StatusService {
  // Updates the user's status in the backend and commits to Vuex
  public async updateStatus (status: string, commit: Commit): Promise<void> {
    try {
      // Make an API call to update the status
      await api.put('/user/status', { status })

      // Commit the new status to the Vuex store
      commit('auth/SET_STATUS', status, { root: true }) // Assumes auth namespace
      console.log('Status successfully updated:', status)
    } catch (error) {
      console.error('Failed to update status:', error)
      throw error // Optional: re-throw error if you want to handle it in the caller
    }
  }

  // Retrieves the current user status from the backend (if needed)
  public async fetchStatus (): Promise<string> {
    try {
      const response = await api.get('/user/status')
      return response.data.status // Assumes the response contains a 'status' field
    } catch (error) {
      console.error('Failed to fetch status:', error)
      throw error
    }
  }
}

export default new StatusService()
