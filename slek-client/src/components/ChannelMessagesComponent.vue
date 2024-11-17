<template>
  <q-scroll-area ref="area" :style="'width: 100%; height:' + (displayMessageIndex > -1 ? 'calc(100vh - 304px)' : 'calc(100vh - 204px)')">

    <div v-if="loading" style="text-align: center; margin-bottom: 10px;">
      <q-spinner-dots />
    </div>

    <div style="width: 100%; margin: 0 auto; padding: 30px">
      <template v-for="message in localMessages" :key="message.id">
        <div :class="{ 'bg-purple-2': message.content.includes('@' + user?.nickname) }">
          <q-chat-message
            v-if="message.author"
            :name="message.author.nickname"
            :text="[message.content]"
            :stamp="timeAgo(message.created_at)"
            :sent="isMine(message)"
            :bg-color="isMine(message) ? 'gray-7' : 'blue-4'"
          />
          <q-chat-message
            v-else
            name="[SYSTEM]"
            :text="[message.content]"
            :stamp="timeAgo(message.created_at)"
            :sent="false"
            :bg-color="false ? 'gray-7' : 'blue-4'"
          />
        </div>
      </template>
    </div>

  </q-scroll-area>

  <q-list class="bg-white" style="padding: 0; margin: 0;">
    <q-item v-if="displayMessageIndex > -1" style="height: 100px; max-height: 100px; padding: 0;" class="bg-amber-1">
      <q-list style="width: 100%; padding: 0; margin: 0;">
        <q-item class="text-bold bg-amber-2" style="margin: 0; padding: 0; min-height: 20px; max-height: 20px;">
          <q-item-section>
            <p style="margin: 0; padding: 0 10px;">Message content</p>
          </q-item-section>
          <q-item-section side>
            <div @click="displayMessageIndex = -1" style="width: 20px; height: 20px; border: none; border-radius: 50%; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              ×
            </div>
          </q-item-section>
        </q-item>
        <q-scroll-area style="height: 80px; width: 100%; padding: 0 10px;">
          <q-list>
            <p style="margin: 0;">{{ liveMessages.get(displayMessageIndex)?.content }}</p>
          </q-list>
        </q-scroll-area>
      </q-list>
    </q-item>
    <q-item style="padding: 0; margin: 0; max-height: 50px; height: 50px;">
      <q-item-section side>
        Curently typing:
      </q-item-section>
      <q-item-section>
        <q-list style="padding: 0; margin: 0; max-height: 50px; height: 50px; display: flex; flex-wrap: nowrap; overflow-y: hidden; overflow-x: auto; width: 100%;">
          <q-item
            v-for="([key, value], index) in liveMessages"
            :key="index"
            style="padding: 0 5px; margin: 0; max-height: 50px; height: 50px; display: inline-flex;"
            :class="displayMessageIndex === key ? 'bg-amber-2' : 'bg-white'">
            <q-item-section>
              <q-item-label @click="displayLiveMessage(key)" class="link-text text-primary" style="cursor: pointer; text-decoration: underline; max-height: 30px;">
                {{ getUserById(value.created_by)?.nickname }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { api } from 'src/boot/axios'
import { QScrollArea } from 'quasar'
import { SerializedMessage } from 'src/contracts'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChannelMessagesComponent',
  data () {
    return {
      autoScrollToTheBottom: true,
      loading: false,
      hasMoreMessages: true,
      localMessages: [] as SerializedMessage[]
    }
  },
  props: {
    messages: {
      type: Array as PropType<SerializedMessage[]>,
      default: () => []
    }
  },
  mounted () {
    this.$nextTick(() => {
      const area = this.$refs.area as QScrollArea
      if (area) {
        this.scrollMessages()
        const scrollTarget = area.getScrollTarget()
        scrollTarget.addEventListener('scroll', this.onScroll)
      }
    })
  },
  beforeUnmount () {
    const area = this.$refs.area as QScrollArea
    if (area) {
      const scrollTarget = area.getScrollTarget() as HTMLElement
      scrollTarget.removeEventListener('scroll', this.onScroll)
    }
  },
  watch: {
    localMessages: {
      immediate: true,
      handler () {
        this.$nextTick(() => this.scrollMessages())
      },
      deep: true
    },
    messages: {
      immediate: true,
      handler (newMessages) {
        this.autoScrollToTheBottom = true
        this.loading = false
        this.hasMoreMessages = true
        this.localMessages = [...newMessages]
        this.$nextTick(() => this.scrollMessages())
      },
      deep: true
    },
    activeChannel: {
      immediate: true,
      handler () {
        this.$nextTick(() => this.scrollMessages())
      },
      deep: true
    }
  },
  computed: {
    displayMessageIndex: {
      get () {
        return this.$store.state.auth.displayMessageIndex
      },
      set (value: number) {
        this.$store.commit('auth/SET_DISPLAY_MESSAGE_INDEX', value)
      }
    },
    liveMessages () {
      return this.$store.state.auth.liveMessages
    },
    currentUser () {
      return this.$store.state.auth.user?.id
    },
    user () {
      return this.$store.state.auth.user
    },
    activeChannel () {
      return this.$store.state.channels.active
    },
    onlineUsers () {
      return this.$store.state.auth.onlineUsers
    }
  },
  methods: {
    getUserById (id: number) {
      for (const user of this.onlineUsers.values()) { if (user.id === id) return user }
      return undefined
    },
    async loadMoreMessages () {
      if (this.loading || !this.hasMoreMessages) return
      this.loading = true
      const olderMessages: SerializedMessage[] = await this.fetchOlderMessages()
      if (olderMessages.length) {
        const area = this.$refs.area as QScrollArea
        const scrollTarget = area.getScrollTarget() as HTMLElement
        const currentScrollPosition = scrollTarget.scrollHeight - scrollTarget.scrollTop

        this.localMessages.unshift(...olderMessages)

        this.$nextTick(() => {
          scrollTarget.scrollTop = scrollTarget.scrollHeight - currentScrollPosition
        })
      } else {
        this.hasMoreMessages = false
      }
      this.loading = false
    },
    async fetchOlderMessages (): Promise<SerializedMessage[]> {
      const channelId = this.activeChannel?.id
      const fromTimestamp = this.localMessages[0].created_at
      console.log('fetching older messages older than ' + fromTimestamp + ' in channel id = ' + channelId, this.localMessages[0])
      const messages = (await api.post('channel/fetchMessages', { channelId, fromTimestamp })).data
      return await messages
    },
    onScroll (event: Event) {
      const target = event.target as HTMLElement
      const scrollTop = target.scrollTop
      const scrollHeight = target.scrollHeight
      const clientHeight = target.clientHeight
      if (scrollTop === 0) { this.loadMoreMessages() }
      if (scrollTop + clientHeight >= scrollHeight) { this.autoScrollToTheBottom = true } else this.autoScrollToTheBottom = false
    },
    scrollMessages () {
      if (!this.autoScrollToTheBottom) return
      const area = this.$refs.area as QScrollArea
      if (area) {
        const scrollTarget = area.getScrollTarget()
        const scrollHeight = scrollTarget.scrollHeight
        const clientHeight = scrollTarget.clientHeight
        scrollTarget.scrollTop = scrollHeight - clientHeight
      }
    },
    isMine (message: SerializedMessage): boolean {
      if (message.author.id === 0) { return false }
      return message.author.id === this.currentUser
    },
    timeAgo (timestamp: string) {
      const now = new Date().getTime()
      const date = new Date(timestamp).getTime()
      const secondsAgo = Math.floor((now - date) / 1000)

      if (secondsAgo < 60) return 'just now'
      const minutesAgo = Math.floor(secondsAgo / 60)
      if (minutesAgo < 60) return `${minutesAgo} minutes ago`
      const hoursAgo = Math.floor(minutesAgo / 60)
      if (hoursAgo < 24) return `${hoursAgo} hours ago`
      const daysAgo = Math.floor(hoursAgo / 24)
      if (daysAgo < 30) return `${daysAgo} days ago`
      const monthsAgo = Math.floor(daysAgo / 30)
      if (monthsAgo < 12) return `${monthsAgo} months ago`
      const yearsAgo = Math.floor(monthsAgo / 12)
      return `${yearsAgo} years ago`
    },
    displayLiveMessage (index: number) {
      this.displayMessageIndex = index
    }
  }
})
</script>
