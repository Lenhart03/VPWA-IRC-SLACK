<template>
  <q-layout view="hHh Lpr fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawer = ref(false)
    return { leftDrawer }
  }
})
</script>
