<template>
  <q-item clickable v-ripple v-if="!(localValue && invite)">
    <q-item-section avatar>
      <q-icon v-if="channelType === ChannelType.PRIVATE" name="lock" />
      <q-icon v-else name="public" />
    </q-item-section>
    <q-item-section>
      {{ channelName }}
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
  <q-item v-else class="bg-amber-1">
    <q-item-section avatar>
      <q-icon v-if="channelType === ChannelType.PRIVATE" name="lock" />
      <q-icon v-else name="public" />
    </q-item-section>
    <q-item-section>
      {{ channelName }}
    </q-item-section>
    <q-item-section side>
      <q-btn-group>
        <q-btn round icon="check" class="bg-green-2" @click="acceptInvite" />
        <q-btn round icon="close" class="bg-red-2" @click="rejectInvite" />
      </q-btn-group>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { ChannelType } from 'src/contracts'
import { channelService } from 'src/services'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'ChannelItem',

  data () {
    return {
      ChannelType,
      menu: false,
      localValue: true
    }
  },

  props: {
    channelName: String,
    channelType: {
      type: String as PropType<ChannelType>,
      required: false
    },
    channelId: {
      type: Number,
      required: false
    },
    invite: {
      type: Boolean,
      required: false
    }
  },

  methods: {
    leaveChannel () {
      channelService.leaveChannel(this.channelId, this.$store)
    },
    acceptInvite () {
      channelService.acceptInvite(this.channelId, this.$store)
    },
    rejectInvite () {
      channelService.rejectInvite(this.channelId, this.$store)
    }
  }
})
</script>
