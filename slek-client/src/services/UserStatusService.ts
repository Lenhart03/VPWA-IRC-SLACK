import { api } from 'src/boot/axios'

class StatusService {
  // Updates the user's status in the backend
  public async updateStatus (status: string): Promise<void> {
    try {
      // Make an API call to update the status
      await api.put('/user/status', { status })
      console.log('Status successfully updated:', status)
    } catch (error) {
      console.error('Failed to update status:', error)
      throw error // Re-throw error if you want to handle it in the caller
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
