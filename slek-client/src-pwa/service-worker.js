// Add listener for push events (from your backend)
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Notification'
  const options = {
    body: data.body || 'You have a new message!',
    icon: data.icon || '/icons/icon-128x128.png', // Adjust icon path
    badge: data.badge || '/icons/badge-72x72.png', // Adjust badge path
    data: data.url || '/' // aURL to open when notification is clicked
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle notification click event
self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const urlToOpen = event.notification.data || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})
