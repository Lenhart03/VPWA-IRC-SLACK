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
          v-for="channel in channels"
          v-bind:key="channel.id"
          :channel_model=channel
        />
    </q-list>
  </q-drawer>

  <!-- Main Content Area -->
  <q-page class="flex column full-witdh" >
    <div class="q-pa-md column col justify-end" v-if="activeChannel">
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
          <q-avatar size="50px" @click="menu = true" class="cursor-pointer">
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="Profile" />
          </q-avatar>
          <div class="q-ml-sm">
            <div class="text-subtitle2"></div>
            <div class="text-caption">{{ status }}</div> <!-- Dynamic status text -->
          </div>

          <!-- Dropdown menu for changing status -->
          <q-menu v-model="menu" anchor="bottom left" self="top left">
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
        <q-input v-model="text" label="Type a command" dense filled rounded
          class="q-mx-auto q-pa-md"
          style="width: 80%; max-width: 80%;"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage" />
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

export default {
  mounted () {
    if (!this.$store.getters['main/getUser']) {
      this.$router.push('/login')
    }
  },
  data () {
    return {
      leftDrawerOpen: true,
      currentChannel: 'general',
      message: '',
      text: '',
      status: 'Online',
      menu: false,
      newChannelName: '',
      isPrivate: false,
      showCreateChannelDialog: false,
      log_off_menu: false
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
    }
  },
  components: {
    ChannelItem
  },
  methods: {
    sendMessage () {
      // Handle sending message
      if (this.message.trim() !== '') {
        console.log(`Message sent: ${this.message}`)
        this.message = ''
      }
    },
    createChannel () {
      console.log('Create new channel clicked')
      this.showCreateChannelDialog = true
    },
    setStatus (newStatus: string) {
      this.status = newStatus
      this.menu = false
    },
    submitNewChannel () {
      if (this.newChannelName.trim() !== '') {
        console.log(`New Channel Created: ${this.newChannelName}, Private: ${this.isPrivate}`)
        // Here you would handle creating the new channel (e.g., calling an API)
        this.newChannelName = ''
        this.isPrivate = false
        this.showCreateChannelDialog = false
      } else {
        console.log('Channel name is required')
      }
    },
    logOff () {
      this.$store.commit('main/setUser', null)
      this.$router.push('/login')
    }
  }
}
</script>
