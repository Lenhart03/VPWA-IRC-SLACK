<template>
  <!-- Header -->
  <q-header class="bg-primary text-white" elevated>
      <q-toolbar>

        <!-- Left Side: Optional settings or other buttons -->
        <q-btn flat icon="settings" @click="openSettings" aria-label="Settings" />

        <!-- Space before centered text -->
        <q-space />

        <!-- Centered title (current channel) -->
        <div class="text-h6">
          {{ currentChannel }}
        </div>

        <!-- Space after centered text -->
        <q-space />

      </q-toolbar>
    </q-header>

  <!-- Sidebar (Drawer) -->
  <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-grey-1" elevated>
    <q-list padding>
      <q-item-label header>Channels</q-item-label>
      <q-item clickable v-ripple @click="selectChannel('general')">
        <q-item-section avatar>
          <q-icon name="chat" />
        </q-item-section>
        <q-item-section>
          # General
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="selectChannel('random')">
        <q-item-section avatar>
          <q-icon name="tag" />
        </q-item-section>
        <q-item-section>
          # Random
        </q-item-section>
      </q-item>

      <!-- Button at the Bottom to Add Channel -->
      <q-page-sticky position="bottom" class="q-px-md q-pb-md">
        <q-btn
          round
          color="primary"
          icon="add"
          @click="createChannel"
          aria-label="Create New Channel"
        />
      </q-page-sticky>
    </q-list>
  </q-drawer>

  <!-- Main Content Area -->
  <q-page class="flex column full-witdh" >
    <div class="q-pa-md column col justify-end">
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
        size="6"
        stamp="4 minutes ago"
        text-color="white"
        bg-color="primary"
      />
      <q-chat-message
        name="Jane"
        :text="['Did it work?']"
        stamp="1 minutes ago"
        size="8"
        text-color="white"
        bg-color="primary"
      />
    </div>
    <q-footer elevated>
      <q-toolbar class="justify-center q-pa-md">
        <q-input v-model="text" label="Type a message" dense filled rounded
          class="q-mx-auto q-pa-md"
          style="width: 80%; max-width: 600px;"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage" />
          </template>
        </q-input>

      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script lang="ts">

export default {
  data () {
    return {
      leftDrawerOpen: true,
      currentChannel: 'general',
      message: '',
      text: ''
    }
  },
  methods: {
    openSettings () {
      // Handle settings opening
      console.log('Settings clicked')
    },
    selectChannel (channel: string) {
      this.currentChannel = channel
    },
    sendMessage () {
      // Handle sending message
      if (this.message.trim() !== '') {
        console.log(`Message sent: ${this.message}`)
        this.message = ''
      }
    },
    createChannel () {
      // Logic to create a new channel goes here
      console.log('Create new channel clicked')
    }
  }
}
</script>
