import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UserStatusInterface } from './state'

const getters: GetterTree<UserStatusInterface, StateInterface> = {
  status: (state) => state.status
}

export default getters
