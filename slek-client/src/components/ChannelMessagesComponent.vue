<template>
  <q-scroll-area ref="area" style="width: 100%; height: calc(100vh - 154px)">

    <div style="width: 100%; margin: 0 auto; padding: 30px">
      <template v-for="message in messages" :key="message.id">
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
import { QScrollArea } from 'quasar'
import { SerializedMessage } from 'src/contracts'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChannelMessagesComponent',
  mounted () {
    this.$nextTick(() => this.scrollMessages())
  },
  props: {
    messages: {
      type: Array as PropType<SerializedMessage[]>,
      default: () => []
    }
  },
  watch: {
    messages: {
      immediate: true,
      handler () {
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
    scrollMessages () {
      const area = this.$refs.area as QScrollArea
      area && area.setScrollPercentage('vertical', 10.0)
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
