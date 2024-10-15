<template>
  <q-item clickable v-ripple @click="selectChannel()">
    <q-item-section avatar>
      <q-icon v-if="channel_model?.type === ChannelType.Private" name="lock" />
      <q-icon v-else name="public" />
    </q-item-section>
    <q-item-section>
      {{ channel_model.name }}
    </q-item-section>
    <q-item-section side>
      <q-icon clickable name="more_vert" @click.stop="menu = !menu" round></q-icon>
      <q-menu v-model="menu" anchor="bottom left" self="center left" class="bg-red text-white">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section @click="leaveChannel()">Leave</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Channel, ChannelMember, ChannelType } from 'components/models'
export default defineComponent({
  name: 'ChannelItem',

  data () {
    return {
      ChannelType,
      menu: false
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
    },
    leaveChannel () {
      const channelMember: ChannelMember = {
        channel_id: this.channel_model.id,
        user_id: this.$store.getters['main/getUser']
      }
      this.$store.commit('main/leaveChannel', channelMember)
    }
  }
})
</script>
