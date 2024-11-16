<template>
  <q-page class="bg-grey-2">
    <channel-messages-component :messages="messages" ref="channelMessagesComponent" />
  </q-page>
</template>

<script lang="ts">
import ChannelMessagesComponent from 'src/components/ChannelMessagesComponent.vue'
import { SerializedMessage } from 'src/contracts'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { ChannelMessagesComponent },
  name: 'ChannelPage',
  computed: {
    messages (): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages']
    }
  }
})
</script>
