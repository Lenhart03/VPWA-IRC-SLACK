import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { RawMessage, ChannelData } from 'src/contracts'

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async joinUserChannels ({ dispatch }, userId: number) {
    try {
      const channels = await channelService.getJoinedChannels(userId)
      for (const channel of channels) { dispatch('join', channel.id) }
    } catch (err) {
      console.log('ERROR joinUserChannels', err)
      throw err
    }
  },
  async join ({ commit }, channelId: number) {
    try {
      commit('LOADING_START')
      const messages = await channelService.join(channelId).loadMessages()
      commit('LOADING_SUCCESS', { channelId, messages })
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  async leave ({ getters, commit }, channelId: number) {
    const leaving: number[] = channelId !== null ? [channelId] : getters.joinedChannels

    leaving.forEach((c) => {
      channelService.leave(c)
      commit('CLEAR_CHANNEL', c)
    })
  },
  async addMessage ({ commit }, { channelId, message }: { channelId: number, message: RawMessage }) {
    const newMessage = await channelService.in(channelId)?.addMessage(message)
    commit('NEW_MESSAGE', { channelId, message: newMessage })
  },
  async create ({ commit }, form: ChannelData) {
    try {
      const channel = await channelService.create(form, commit)
      channelService.join(channel.id)
      return channel
    } catch (err) {
      console.log('ERROR at createChannel', err)
      throw err
    }
  }
}

export default actions
