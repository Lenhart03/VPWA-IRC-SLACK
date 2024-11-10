<template>
  <q-scroll-area ref="area" style="width: 100%; height: calc(100vh - 150px)">
    <div style="width: 100%; max-width: 400px; margin: 0 auto;">
      <q-chat-message v-for="message in messages"
        :key="message.id"
        :name="message.author.nickname"
        :text="[message.content]"
        :stamp="timeAgo(message.createdAt)"
        :sent="isMine(message)"
      />
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { QScrollArea } from 'quasar'
import { SerializedMessage } from 'src/contracts'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChannelMessagesComponent',
  props: {
    messages: {
      type: Array as PropType<SerializedMessage[]>,
      default: () => []
    }
  },
  watch: {
    messages: {
      handler () {
        this.$nextTick(() => this.scrollMessages())
      },
      deep: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user?.id
    }
  },
  methods: {
    scrollMessages () {
      const area = this.$refs.area as QScrollArea
      area && area.setScrollPercentage('vertical', 1.1)
    },
    isMine (message: SerializedMessage): boolean {
      return message.author.id === this.currentUser
    },
    timeAgo (timestamp: string) {
      const now = new Date().getTime()
      const date = new Date(timestamp).getTime()
      const secondsAgo = Math.floor((now - date) / 1000)

      if (secondsAgo < 60) return `${secondsAgo} seconds ago`
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
