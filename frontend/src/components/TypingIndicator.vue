<template>
<div v-if="usersTyping.length > 0" class="typing-indicator">
    <q-banner
    dense
    inline-actions
    class="q-mb-md"
    @click="showTypingMessage"
    >
    <q-icon name="message" />
    <span>{{ typingMessage }}</span>
    </q-banner>

    <q-dialog v-model="dialogVisible">
    <q-card>
        <q-card-section class="q-pt-none">
        <div class="text-h6">{{ activeTypingUser.name }} is typing...</div>
        <div class="q-mt-md">{{ activeTypingUser.message }}</div>
        </q-card-section>
        <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
    </q-card>
    </q-dialog>
</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingIndicator',
  data () {
    return {
      usersTyping: [] as Array<{ id: number; name: string; message: string }>, // Typing users
      activeTypingUser: { id: 0, name: '', message: '' }, // User currently typing
      dialogVisible: false // For showing the user's typing message
    }
  },
  computed: {
    typingMessage () {
      // Display a dynamic message like 'User1 is typing...', 'User1 and User2 are typing...'
      const userNames = this.usersTyping.map((user) => user.name)
      return userNames.join(', ') + (userNames.length > 1 ? ' are typing...' : ' is typing...')
    }
  },
  methods: {
    showTypingMessage () {
      // Show a dialog with the current typing user's message
      if (this.usersTyping.length > 0) {
        this.activeTypingUser = this.usersTyping[0] // Show the first user typing
        this.dialogVisible = true
      }
    },
    addTypingUser (user: { id: number; name: string; message: string }) {
      // Add user to typing list if not already there
      const existingUser = this.usersTyping.find((u) => u.id === user.id)
      if (!existingUser) {
        this.usersTyping.push(user)
      } else {
        existingUser.message = user.message // Update message if the user is already typing
      }
    },
    removeTypingUser (userId: number) {
      // Remove the user from typing list
      this.usersTyping = this.usersTyping.filter((user) => user.id !== userId)
    }
  }
})
</script>

<style scoped>
.typing-indicator {
  position: relative;
  bottom: 0;
  margin-bottom: 10px;
  width: 100%;
}
</style>
