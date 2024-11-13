/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

// User status update route
Route.put('user/status', 'UsersController.updateStatus').middleware('auth')

Route.resource('channel', 'ChannelsController').middleware({ '*': ['auth'] })
Route.post('invite', 'ChannelsController.invite').middleware('auth')
Route.post('leave', 'ChannelsController.leave').middleware('auth')
Route.post('accept', 'ChannelsController.accept').middleware('auth')
Route.post('reject', 'ChannelsController.reject').middleware('auth')
Route.post('cancel', 'ChannelsController.cancel').middleware('auth')
Route.post('revoke', 'ChannelsController.revoke').middleware('auth')
Route.post('/channels/join', 'ChannelsController.join').middleware('auth')
Route.delete('/channels/delete', 'ChannelsController.deleteChannel').middleware('auth')
