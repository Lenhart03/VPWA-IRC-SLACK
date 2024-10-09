<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
    ></example-component>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { Todo, Meta } from 'components/models'

export default defineComponent({
  name: 'IndexPage',

  components: {
  },

  data () {
    return { }
  }
})
</script>
