<template>
  <q-layout view="pHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          IRC Slack
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Channels
        </q-item-label>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  data () {
    return {
      leftDrawerOpen: true
    }
  },

  methods: {
  }
})
</script>
