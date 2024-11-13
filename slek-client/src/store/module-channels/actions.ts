import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { RawMessage, ChannelData } from 'src/contracts'
import MessageService from 'src/services/MessageService'
import { api } from 'src/boot/axios'
import { AxiosError } from 'axios'

function isAxiosError (error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined
}

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
  async joinChannelByName ({ commit }, channelName: string) {
    try {
      // Call the service to attempt joining the channel
      const channel = await channelService.joinChannelByName(channelName)

      // If successful, add channel to the Vuex state
      commit('ADD_CHANNEL', channel)
      commit('SET_ACTIVE_CHANNEL', channel)
      return true
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        console.log(`Channel "${channelName}" not found.`)
        return false // Indicate the channel was not found
      } else {
        console.error('Failed to join channel:', error)
        throw error
      }
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
  async deleteChannel ({ commit }, channelId: number) {
    try {
      await api.delete('/channels/delete', { data: { channelId } })
      commit('DELETE_CHANNEL', channelId) // Update state to remove the deleted channel
    } catch (error) {
      console.error('Failed to delete channel:', error)
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
  },
  async fetchChannels ({ commit }, userId: number) {
    try {
      const response = await api.get('/channel?user_id=' + userId)
      commit('SET_CHANNELS', response.data)
    } catch (error) {
      console.error('Failed to fetch channels:', error)
    }
  },
  async loadMessages ({ commit, state }, { channelId }) {
    const currentPage = state.pagination[channelId]?.page || 1
    const nextPage = currentPage + 1
    const hasMore = state.pagination[channelId]?.hasMore !== false // Continue only if more pages are available

    if (!hasMore) return // Stop if no more pages are available

    try {
      // Fetch messages using MessageService
      const messages = await MessageService.loadMessages(channelId, nextPage, commit)

      // Assume we received all pages if fewer messages than expected (e.g., < 20)
      const hasMorePages = messages.length >= 20

      // Commit the messages and pagination info
      commit('ADD_MESSAGES', {
        channelId,
        messages,
        page: nextPage,
        hasMore: hasMorePages
      })
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }
}

export default actions
