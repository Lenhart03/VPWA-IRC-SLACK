<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-btn flat icon="exit_to_app" @click="logout" aria-label="Settings" />
        <q-space />
        <div class="text-h6" v-if="activeChannel">
          {{ activeChannel.name }}
        </div>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :breakpoint="690"
    >
      <div class="row items-center justify-between q-mb-md q-pl-md q-pr-md">
          <q-item-label header>Channels</q-item-label>
          <q-btn round dense flat icon="add" @click.stop="openCreateChannelDialog" aria-label="Add New Chat" />
      </div>
      <q-scroll-area style="height: calc(100% - 70px)">
        <q-list>
          <ChannelItem
            v-for="(invite, index) in invites"
            :key="index"
            :channelName="invite.name"
            :channelType="invite.type"
            :channelId="invite.id"
            :invite="true"
          />
          <ChannelItem
            v-for="(channel, index) in channels"
            :key="index"
            :channelName="channel.name"
            :channelType="channel.type"
            :channelId="channel.id"
            clickable
            @click="setActiveChannel(channel)"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <div class="column col justify-end" v-if="activeChannel">
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>
    <q-footer elevated>
      <q-toolbar class="q-pa-md">

        <!-- Profile Avatar on the left with clickable menu -->
        <div class="row items-center">
          <!-- Profile with Q-Menu -->
          <q-avatar size="50px" @click="status_menu = true" class="cursor-pointer">
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="Profile" />
          </q-avatar>
          <div class="q-ml-sm" v-if="user">
              <div class="text-subtitle2">{{ user.firstname + ' ' + user.lastname }}</div>
              <div class="text-caption">{{ user.status.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') }}</div>
            </div>

          <!-- Dropdown menu for changing status -->
          <q-menu v-model="status_menu" anchor="bottom left" self="top left">
            <q-list>
              <q-item clickable v-ripple @click="setStatus('online')">
                <q-item-section avatar><q-icon name="cloud_done" /></q-item-section>
                <q-item-section>Online</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="setStatus('offline')">
                <q-item-section avatar><q-icon name="cloud_off" /></q-item-section>
                <q-item-section>Offline</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="setStatus('dnd')">
                <q-item-section avatar><q-icon name="do_not_disturb" /></q-item-section>
                <q-item-section>Do Not Disturb</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <!-- Space between profile and input -->
        <q-space />

        <!-- Centered Input Field -->
        <q-input v-model="message" label="Type a command" dense filled rounded
          class="q-mx-auto q-pa-md"
          style="width: 80%; max-width: 80%;"
          @keydown.enter="send()"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="send" :disable="!activeChannel" />
          </template>
        </q-input>

      </q-toolbar>
    </q-footer>

    <!-- Dialog for creating a new channel -->
    <q-dialog v-model="showCreateChannelDialog" persistent @keydown.esc="showCreateChannelDialog = false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Create a New Channel</div>
        </q-card-section>

        <q-card-section>
          <!-- Input for Channel Name -->
          <q-input
            v-model="newChannelData.name"
            label="Channel Name"
            dense
            filled
            autofocus
            @keydown.enter="submitNewChannel"
          />

          <!-- Toggle for Public or Private -->
          <q-toggle
            v-model="newChannelData.private"
            label="Private Channel"
            left-label
            color="primary"
          />

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="showCreateChannelDialog = false" />
          <q-btn flat label="Create" color="primary" @click="submitNewChannel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script lang="ts">
import ChannelItem from 'components/ChannelItem.vue'
import { ChannelType } from 'src/contracts'
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { channelService } from 'src/services'

export default defineComponent({
  name: 'ChatLayout',
  mounted () {
    console.log(this.user)
    this.joinUserChannels(this.user.id)
    this.$store.commit('channels/INIT_LOAD_CHANNELS')
    setTimeout(() => {
      this.$store.commit('channels/SET_ACTIVE', this.channels[0])
    }, 100)
  },
  data () {
    return {
      leftDrawerOpen: true,
      message: '',
      loading: false,
      showCreateChannelDialog: false,
      status_menu: false,
      status: 'Online',
      newChannelData: {
        name: '',
        private: false
      }
    }
  },
  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels'
    }),
    activeChannel () {
      return this.$store.state.channels.active
    },
    ...mapGetters('auth', {
      user: 'user'
    }),
    user_status: {
      get () {
        return this.$store.getters('auth/user').status
      },
      set (value: 'offline' | 'online' | 'dnd') {
        this.$store.commit('auth/SET_USER_STATUS', value)
      }
    },
    invites () {
      return JSON.parse(JSON.stringify(this.$store.getters['channels/invites']))
    },
    ...mapGetters('user', {
      userStatus: 'status'
    })
  },
  components: {
    ChannelItem
  },
  methods: {
    async send () {
      if (!this.activeChannel) return
      this.message = this.message.trim()
      if (this.message[0] === '/') {
        const args = this.message.split(' ')
        switch (args[0]) {
          case '/invite':
          {
            const nickname = args[1]
            console.log('inviting', nickname, 'to', this.activeChannel)
            channelService.inviteUserToChannel(nickname, this.activeChannel?.id)
            break
          }
          case '/join': {
            const channelName = args[1]
            if (channelName) {
              console.log('Attempting to join channel:', channelName)
              const joinedSuccessfully = await this.joinChannelByName(channelName)

              if (!joinedSuccessfully) {
                // If the channel does not exist, prompt the user to create it
                this.newChannelData.name = channelName // Pre-fill the channel name
                this.openCreateChannelDialog() // Open the create channel dialog
              }
              await this.fetchChannels(this.user.id) // Make sure fetchChannels is awaited to complete
              console.log('Updated channels:', this.channels) // Log the channels to verify
            } else {
              console.error('Channel name not specified for join.')
            }
            break
          }
          default:
            console.warn('Unknown command:', args[0])
        }
      } else {
        this.loading = true
        await this.addMessage({ channelId: this.activeChannel?.id, message: this.message })
        this.loading = false
      }
      this.message = ''
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage']),
    ...mapActions('channels', ['joinUserChannels']),
    ...mapActions('channels', ['fetchChannels', 'joinChannelByName']),
    submitNewChannel () {
      this.showCreateChannelDialog = false
      this.$store.dispatch('channels/create', {
        name: this.newChannelData.name,
        type: this.newChannelData.private ? ChannelType.PRIVATE : ChannelType.PUBLIC
      })
      this.newChannelData.name = '' // Clear the field after creating the channel
    },
    ...mapActions('user', ['updateStatus']),
    setStatus (status: 'online' | 'offline' | 'dnd') {
      this.user_status = status.toLowerCase()
      this.status_menu = false // Close the dropdown menu
      this.updateStatus(status) // Dispatch the action to update status
      console.log('Status set to: ', status) // Optional: Console log for debugging
    },
    openCreateChannelDialog () {
      if (!this.showCreateChannelDialog) this.showCreateChannelDialog = true
    }
  }
})
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
    background-color: #009688
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px
  &__field.q-field--outlined .q-field__control:before
    border: none
  .q-drawer--standard
    .WAL__drawer-close
      display: none
@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
