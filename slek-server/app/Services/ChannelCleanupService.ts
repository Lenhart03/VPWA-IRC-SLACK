import Channel from 'App/Models/Channel'
import { DateTime } from 'luxon'

export default class ChannelCleanupService {
  // This method will run every day (or at any interval you prefer) to clean up inactive channels
  public static async deleteInactiveChannels() {
    // Get the current date and time minus 30 days
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQLDate() // 'YYYY-MM-DD'

    // Find channels that have no messages after the 30-day threshold
    const inactiveChannels = await Channel.query().whereNotExists((query) => {
      query
        .select('*')
        .from('messages')
        .whereRaw('messages.channel_id = channels.id')
        .where('messages.created_at', '>=', thirtyDaysAgo)
    })

    // Delete each inactive channel
    for (const channel of inactiveChannels) {
      await channel.delete()
      console.log(`Deleted inactive channel: ${channel.id}`)
    }
  }
}
