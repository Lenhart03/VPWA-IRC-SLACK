<template>
  <q-page padding class="full-height full-width row justify-center items-center q-pa-sm">
      <q-card class="col-12 q-pa-md q-mb-lg" style="max-width: 400px;">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" ref="loginForm">
            <q-input
              v-model="email"
              label="Email"
              type="email"
              :rules="[val => !!val || 'Email is required']"
              outlined
            />

            <q-input
              v-model="password"
              label="Password"
              type="password"
              :rules="[val => !!val || 'Password is required']"
              outlined
              class="q-mt-md"
            />

            <q-btn
              label="Log in"
              type="submit"
              color="primary"
              class="full-width q-mt-lg"
              :disable="!email || !password"
            />
          </q-form>
        </q-card-section>
      </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'LoginPage',

  data () {
    return {
      email: '',
      password: '',
      router: useRouter()
    }
  },

  methods: {
    async onSubmit () {
      this.router.push('/')
    }
  }
})
</script>
