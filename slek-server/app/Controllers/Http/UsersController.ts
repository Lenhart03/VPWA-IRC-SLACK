import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async updateStatus({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate() // Ensure the user is authenticated
      const newStatus = request.input('status') // Get 'status' from the request body

      if (!newStatus) {
        return response.badRequest({ message: 'Status is required' }) // Handle missing status
      }

      user.status = newStatus // Update the user's status
      await user.save() // Save the changes to the database

      return response.ok({ status: 'success', message: 'Status updated successfully' })
    } catch (error) {
      console.error('Error updating status:', error) // Log the error for debugging
      return response.status(500).json({ status: 'error', message: 'Failed to update status' })
    }
  }
}
