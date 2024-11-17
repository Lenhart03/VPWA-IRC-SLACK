<template>
  <q-scroll-area ref="area" style="width: 100%; height: calc(100vh - 154px)">

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
    currentUser () {
      return this.$store.state.auth.user?.id
    },
    user () {
      return this.$store.state.auth.user
    },
    activeChannel () {
      return this.$store.state.channels.active
    }
  },
  methods: {
    async loadMoreMessages () {
      if (this.loading || !this.hasMoreMessages) return
      this.loading = true
      const olderMessages: SerializedMessage[] = await this.fetchOlderMessages()
      if (olderMessages.length) {
        const area = this.$refs.area as QScrollArea
        const scrollTarget = area.getScrollTarget() as HTMLElement
        const currentScrollPosition = scrollTarget.scrollHeight - scrollTarget.scrollTop

        console.warn(this.localMessages)
        this.localMessages.unshift(...olderMessages)
        console.warn(this.localMessages)

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
    }
  }
})
</script>
