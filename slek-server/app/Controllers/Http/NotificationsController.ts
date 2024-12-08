const webPush = require('web-push')

// VAPID keys configuration
webPush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

class NotificationController {
  public async subscribe({ request }) {
    const subscription = request.input('subscription')
    // Save the subscription to the database (replace this with your DB logic)
    console.log('Subscription received:', subscription)
    return { success: true }
  }

  public async sendNotification({ request }) {
    const { subscription, payload } = request.all()

    try {
      await webPush.sendNotification(subscription, JSON.stringify(payload))
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = NotificationController
