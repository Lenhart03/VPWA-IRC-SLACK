<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-btn flat icon="exit_to_app" @click="logout" aria-label="Log Out" />
        <q-space />
        <div class="text-h6" v-if="activeChannel">
          {{ activeChannel.name }}
        </div>
        <q-space />
        <q-btn flat icon="people" @click="openDialog" aria-label="See Channel Members" />
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
          <q-avatar size="50px" class="cursor-pointer">
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="Profile" />
          </q-avatar>
          <div class="q-ml-sm" v-if="user">
            <div class="text-subtitle2">{{ user.firstname + ' ' + user.lastname }}</div>
            <div class="text-caption">{{ user.status.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') }}</div>
          </div>

          <!-- Dropdown menu for changing status -->
          <q-menu v-model="statusMenu" anchor="bottom left" self="top left">
          <q-list>

            <!-- Status Parent Item -->
            <q-item clickable v-ripple @mouseover="statusSubMenu = true">
              <q-item-section avatar><q-icon name="settings" /></q-item-section>
              <q-item-section>Status</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
            </q-item>

            <!-- Status Submenu -->
            <q-menu v-model="statusSubMenu" @mouseenter="statusSubMenu = true" @mouseleave="statusSubMenu = false" anchor="center right" self="top left">
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

            <!-- Notify Only Mentions (Checkbox) -->
            <q-item>
              <q-item-section>
                <q-checkbox v-model="notifyMentionsOnly" label="Notify only mentions"/>
              </q-item-section>
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

    <q-dialog v-model="isDialogOpen">
      <q-card style="min-width: 300px; max-width: 500px;">
        <q-card-section class="row items-center justify-between">
          <span class="text-h6">Members</span>
          <q-btn icon="close" flat @click="closeDialog" />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item v-for="member in members.values()" :key="member.id" clickable :style="{ opacity: isOnline(member) ? '1' : '0.5' }">
              <q-item-section avatar>
                <q-avatar :color="isDnd(member) ? 'red' : 'primary'" text-color="white">
                  {{ member.firstname.charAt(0).toUpperCase() + member.lastname.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ member.firstname }} {{ member.lastname }}</q-item-label>
                <q-item-label class="text-grey">{{ member.nickname }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script lang="ts">
import ChannelItem from 'components/ChannelItem.vue'
import { ChannelType, SerializedMessage } from 'src/contracts'
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { authService, channelService } from 'src/services'
import { User } from 'src/contracts/Auth'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'ChatLayout',
  mounted () {
    console.warn(this.user)
    if (this.user.status !== 'offline') {
      this.joinUserChannels(this.user.id)
    }
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
      statusMenu: false,
      statusSubMenu: false,
      status: 'Online',
      newChannelData: {
        name: '',
        private: false
      },
      isDialogOpen: false
    }
  },
  computed: {
    notifyMentionsOnly: {
      get () {
        return this.$store.getters['auth/notifyMentionsOnly']
      },
      set (value: boolean) {
        authService.setNotifyMentionsOnly(this.$store, value)
      }
    },
    onlineUsers (): Map<number, User> {
      return this.$store.getters['auth/onlineUsers']
    },
    members (): User[] {
      return this.$store.getters['channels/members']
    },
    messages (): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages']
    },
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
    isOnline (user: User) {
      if (this.user.id === user.id) return this.user.status !== 'offline'
      if (!this.onlineUsers.get(user.id)) return false
      return this.onlineUsers.get(user.id)?.status !== 'offline'
    },
    async send () {
      if (this.user.status === 'offline') {
        Notify.create({
          type: 'negative',
          position: 'top',
          message: 'Channel is disconnected due to user having offline status.'
        })
        return
      }
      this.message = this.message.trim()
      if (this.message.length === 0) return
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
            const channelName = this.message.substring(args[0].length + 1)
            console.log('"' + channelName + '"')
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
          case '/quit': {
          // Check if the user is the owner of the active channel
            if (!this.activeChannel) return
            console.log(this.user.id, this.activeChannel.ownerId)
            if (this.user.id === this.activeChannel.ownerId) { // resolve the owner id, then after do -> this.activeChannel.ownerId
              await this.deleteChannel(this.activeChannel.id)
              this.$store.commit('SET_ACTIVE', null) // Optionally, clear the active channel
              console.log(`Channel ${this.activeChannel.name} deleted successfully.`)
            } else {
              console.warn('Only the channel owner can delete this channel.')
            }
            break
          }
          case '/cancel': {
            await channelService.cancel(this.activeChannel?.id, this.$store)
            await this.fetchChannels(this.user.id)
            break
          }
          case '/revoke': {
            if (this.activeChannel?.ownerId !== this.user.id) {
              console.warn('Only channel owner can revoke a member.')
              break
            }
            await channelService.revoke(this.activeChannel?.id, this.message.substring(args[0].length + 1))
            break
          }
          case '/kick': {
            await channelService.kick(this.activeChannel?.id, this.message.substring(args[0].length + 1))
            break
          }
          case '/list': {
            this.openDialog()
            break
          }
          default:
            console.warn('Unknown command:', args[0])
        }
      } else {
        if (!this.activeChannel) return
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
    ...mapActions('channels', ['deleteChannel']), // Map the delete action
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
      console.warn(status, this.user.status)
      if (status === 'offline' && this.user.status !== 'offline') channelService.leaveAllChannels()
      else if (status !== 'offline' && this.user.status === 'offline') this.joinUserChannels(this.user.id)
      this.user_status = status.toLowerCase()
      this.statusMenu = false // Close the dropdown menu
      this.updateStatus(status) // Dispatch the action to update status
      console.log('Status set to: ', status) // Optional: Console log for debugging
    },
    openCreateChannelDialog () {
      if (!this.showCreateChannelDialog) this.showCreateChannelDialog = true
    },
    openDialog () {
      this.isDialogOpen = true
    },
    closeDialog () {
      this.isDialogOpen = false
    },
    isDnd (member: User) {
      if (this.user.id === member.id) return this.user.status === 'dnd'
      return this.onlineUsers.get(member.id)?.status === 'dnd'
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
