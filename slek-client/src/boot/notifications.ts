// eslint-disable-next-line no-empty-pattern
export default async ({ /* app, router, Vue */ }) => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notifications permission denied')
    }
  } else {
    console.warn('Notifications API not supported by the browser.')
  }
}
