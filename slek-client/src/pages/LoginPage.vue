<template>
  <q-page padding class="full-height full-width row justify-center items-center q-pa-sm">
      <q-card class="col-12 q-pa-md q-mb-lg" style="max-width: 400px;">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" ref="loginForm">
            <q-input
              v-model="credentials.email"
              label="Email"
              type="email"
              :rules="[val => !!val || 'Email is required']"
              outlined
            />

            <q-input
              v-model="credentials.password"
              label="Password"
              type="password"
              :rules="[val => !!val || 'Password is required']"
              outlined
              class="q-mt-md"
            />

            <q-item
              clickable :to="{ name: 'register' }"
              class="q-mt-md"
            >
              <q-item-section>Create a new account.</q-item-section>
            </q-item>

            <q-btn
              label="Log in"
              type="submit"
              color="primary"
              class="full-width q-mt-lg"
              :disable="!credentials.email || !credentials.password"
            />
          </q-form>
        </q-card-section>
      </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  data () {
    return {
      credentials: { email: '', password: '' },
      showPassword: false
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return (this.$route.query.redirect as string) || { name: 'home' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/login', this.credentials).then(() => this.$router.push(this.redirectTo))
    }
  }
})
</script>
