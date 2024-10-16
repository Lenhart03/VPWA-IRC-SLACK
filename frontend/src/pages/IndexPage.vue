<template>
  <!-- Header -->
  <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <!-- Menu for Settings -->
        <q-btn flat icon="exit_to_app" @click="logOff" aria-label="Settings" />

        <!-- Space before centered text -->
        <q-space />

        <!-- Centered title (current channel) -->
        <div class="text-h6" v-if="activeChannel">
          {{ activeChannel.name }}
        </div>

        <!-- Space after centered text -->
        <q-space />

      </q-toolbar>
    </q-header>

  <!-- Sidebar (Drawer) -->
  <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-grey-1" elevated>
    <q-list padding>
      <div class="row items-center justify-between q-mb-md q-pl-md q-pr-md">
          <q-item-label header>Channels</q-item-label>
          <q-btn round dense flat icon="add" @click="createChannel" aria-label="Add New Chat" />
      </div>
      <ChannelItem
        v-for="invite in myInvites"
        v-bind:key="invite.channel_id"
        :channel_model=getChannelById(invite.channel_id)
        :invite="invite"
      />
      <ChannelItem
        v-for="channel in userChannels"
        v-bind:key="channel.id"
        :channel_model=channel
      />
    </q-list>
  </q-drawer>

  <!-- Main Content Area -->
  <q-page class="flex column full-witdh" >
    <div class="q-pa-md column col justify-end" v-if="activeChannel">
      <template v-for="l_message of messages">
        <template v-if="l_message.channel_id === activeChannel.id">
          <div v-bind:key="l_message.id" class="q-pl-md q-pr-md" :class="{ 'bg-purple-2': l_message.message.includes('@' + user.username) }">
            <q-chat-message
              v-if="user && l_message.user_id === user.id"
              :name="getMessageSenderNameFromId(l_message.user_id)"
              :text="[l_message.message]"
              stamp="7 minutes ago"
              sent
              bg-color="amber-7"
            />
            <q-chat-message
              v-else
              :name="getMessageSenderNameFromId(l_message.user_id)"
              :text="[l_message.message]"
              stamp="7 minutes ago"
              bg-color="primary"
            />
          </div>
        </template>
      </template>
      <!--
      <q-chat-message
        name="me"
        :text="['hey, how are you?']"
        stamp="7 minutes ago"
        sent
        bg-color="amber-7"
      />
      <q-chat-message
        name="Jane"
        :text="[
          'doing fine, how r you?',
          'I just feel like typing a really, really, REALLY long message to annoy you...'
        ]"
        stamp="4 minutes ago"
        text-color="white"
        bg-color="primary"
      />
      <q-chat-message
        name="Jane"
        :text="['Did it work?']"
        stamp="1 minutes ago"
        text-color="white"
        bg-color="primary"
      />
      -->
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
            <div class="text-caption">{{ status }}</div> <!-- Dynamic status text -->
          </div>

          <!-- Dropdown menu for changing status -->
          <q-menu v-model="status_menu" anchor="bottom left" self="top left">
            <q-list>
              <q-item clickable v-ripple @click="setStatus('Online')">
                <q-item-section avatar><q-icon name="cloud_done" /></q-item-section>
                <q-item-section>Online</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="setStatus('Offline')">
                <q-item-section avatar><q-icon name="cloud_off" /></q-item-section>
                <q-item-section>Offline</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="setStatus('Do Not Disturb')">
                <q-item-section avatar><q-icon name="do_not_disturb" /></q-item-section>
                <q-item-section>Do Not Disturb</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <!-- Space between profile and input -->
        <q-space />

        <!-- Centered Input Field -->
        <q-input v-model="message" label="Type a command" :disable="!activeChannel" dense filled rounded
          class="q-mx-auto q-pa-md"
          style="width: 80%; max-width: 80%;"
          @keydown.enter="sendMessage()"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage" :disable="!activeChannel" />
          </template>
        </q-input>

      </q-toolbar>
    </q-footer>

    <!-- Dialog for creating a new channel -->
    <q-dialog v-model="showCreateChannelDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Create a New Channel</div>
        </q-card-section>

        <q-card-section>
          <!-- Input for Channel Name -->
          <q-input
            v-model="newChannelName"
            label="Channel Name"
            dense
            filled
            autofocus
            @keydown.enter="submitNewChannel(); showCreateChannelDialog = false"
          />

          <!-- Toggle for Public or Private -->
          <q-toggle
            v-model="isPrivate"
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
  </q-page>

</template>

<script lang="ts">
import ChannelItem from 'components/ChannelItem.vue'
import { ChannelMember, User, UserStatus, Message, Channel, ChannelType } from 'src/components/models'
import { Notify } from 'quasar'

export default {
  mounted () {
    if (!this.$store.getters['main/getUser']) {
      this.$router.push('/login')
    }
    this.$store.commit('main/setUserStatus', UserStatus.Online)
  },
  data () {
    return {
      leftDrawerOpen: true,
      message: '',
      newChannelName: '',
      isPrivate: false,
      showCreateChannelDialog: false,
      status_menu: false
    }
  },
  computed: {
    activeChannel () {
      return this.$store.getters['main/getActiveChannel']
    },
    channels () {
      return this.$store.getters['main/getChannels']
    },
    user () {
      return this.$store.getters['main/getUser']
    },
    status () {
      let value: string = ''
      switch (this.user.status) {
        case
          UserStatus.Online: value = 'Online'
          break
        case
          UserStatus.Offline: value = 'Offline'
          break
        case
          UserStatus.DND: value = 'DND'
          break
      }
      return value
    },
    users () {
      return this.$store.getters['main/getUsers']
    },
    messages () {
      return this.$store.getters['main/getMessages']
    },
    channelMembers () {
      return this.$store.getters['main/getChannelMembers']
    },
    userChannels () {
      if (!this.user) return []
      const userChannels: Array<Channel> = []
      for (const lChannel of this.channels) {
        for (const lMember of this.channelMembers) {
          if (lChannel.id === lMember.channel_id && lMember.user_id === this.user.id) {
            userChannels.push(lChannel)
            break
          }
        }
      }
      return userChannels
    },
    getMemersOfActiveChannel () {
      const membersOfActiveChannel: Array<Channel> = []
      if (!this.user) return membersOfActiveChannel
      for (const lChannel of this.channels) {
        if (lChannel.id !== this.activeChannel.id) continue
        for (const lMember of this.channelMembers) {
          if (lMember.channel_id === this.activeChannel.id) {
            membersOfActiveChannel.push(lMember)
          }
        }
      }
      return membersOfActiveChannel
    },
    myInvites () {
      return this.$store.getters['main/myInvites']
    }
  },
  components: {
    ChannelItem
  },
  methods: {
    getChannelById (id: number) {
      for (const e of this.channels) {
        if (e.id === id) return e
      }
    },
    getMessageSenderNameFromId (id: number) {
      let userFullname: string = ''
      this.users.forEach((user: User) => {
        if (user.id === id) {
          userFullname = user.firstname + ' ' + user.lastname
        }
      })
      return userFullname
    },
    sendMessage () {
      // Handle sending message
      if (this.message.trim() !== '') {
        this.message = this.message.trim()
        if (this.message[0] === '/') {
          const args = this.message.split(' ')
          for (let i = 0; i < args.length; i++) {
            switch (args[i]) {
              case '/list':
                console.log(this.getMemersOfActiveChannel)
                break
              case '/invite':
                if (!this.activeChannel) {
                  Notify.create({ type: 'error', message: 'Channel is not selected.' })
                  break
                }
                if (args.length === 1) Notify.create({ type: 'error', message: 'Missing nickname of an user to be invited.' })
                else if (args.length === 2) {
                  if (this.user.username === args[1]) {
                    Notify.create({ type: 'error', message: 'You can not invite yourself.' })
                    break
                  }
                  this.$store.commit('main/invite', args[1])
                }
                break
            }
          }
        } else {
          const message: Message = {
            id: this.messages.length + 1,
            channel_id: this.activeChannel.id,
            user_id: this.user.id,
            message: this.message
          }
          this.$store.commit('main/pushMessage', message)
        }
        this.message = ''
      }
    },
    createChannel () {
      this.showCreateChannelDialog = true
    },
    setStatus (newStatus: string) {
      switch (newStatus) {
        case 'Online':
          this.$store.commit('main/setUserStatus', UserStatus.Online)
          break
        case 'Offline':
          this.$store.commit('main/setUserStatus', UserStatus.Offline)
          break
        case 'Do Not Disturb':
          this.$store.commit('main/setUserStatus', UserStatus.DND)
          break
      }
      console.log(this.myInvites)
      this.status_menu = false
    },
    submitNewChannel () {
      if (this.newChannelName.trim() !== '') {
        const channel: Channel = {
          id: this.channels.length + 1,
          owner_id: this.user.id,
          name: this.newChannelName,
          type: this.isPrivate ? ChannelType.Private : ChannelType.Public
        }
        this.$store.commit('main/pushChannel', channel)
        const channelMember: ChannelMember = {
          channel_id: channel.id,
          user_id: this.user.id
        }
        this.$store.commit('main/addChannelMember', channelMember)
        this.showCreateChannelDialog = false
        this.newChannelName = ''
      }
    },
    logOff () {
      this.$store.commit('main/setUser', null)
      this.$router.push('/login')
    },
    shouldDisplayChannel (channel: Channel) {
      if (channel.type === ChannelType.Public) return true
      if (!this.user) return false
      this.$store.commit('main/setTestChannel', channel)
      for (const member of this.$store.getters['main/getChannelMembers']) {
        if (this.user.id === member.user_id) {
          return true
        }
      }
      return false
    }
  }
}
</script>
