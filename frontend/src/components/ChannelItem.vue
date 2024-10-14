<template>
  <q-item clickable v-ripple @click="selectChannel()">
    <q-item-section avatar>
      <q-icon v-if="channel_model?.type === ChannelType.Private" name="lock" />
      <q-icon v-else name="public" />
    </q-item-section>
    <q-item-section>
      {{ channel_model.name }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Channel, ChannelType } from 'components/models'
export default defineComponent({
  name: 'ChannelItem',

  data () {
    return {
      ChannelType
    }
  },

  props: {
    channel_model: {
      type: Object as () => Channel,
      required: true
    }
  },

  methods: {
    selectChannel () {
      this.$store.commit('main/selectChannel', this.channel_model)
    }
  }
})
</script>
