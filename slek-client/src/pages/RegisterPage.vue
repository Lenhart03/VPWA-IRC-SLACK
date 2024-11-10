<template>
  <q-page padding class="full-height full-width row justify-center items-center q-pa-sm">
    <q-card class="col-12 q-pa-md q-mb-lg" style="max-width: 400px;">
      <q-card-section>
        <div class="text-h6">Sign Up</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" ref="loginForm">
          <q-input
            v-model="form.firstname"
            label="First name"
            type="text"
            :rules="[val => !!val || 'First name is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="form.lastname"
            label="Last name"
            type="text"
            :rules="[val => !!val || 'Last name is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="form.nickname"
            label="Nickname"
            type="text"
            :rules="[val => !!val || 'Nickname is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="form.password_repeated"
            label="Repeat password"
            type="password"
            :rules="[val => !!val || 'Password repeat is required']"
            outlined
          />

          <q-item
            clickable :to="{ name: 'login' }"
            class="q-mt-md"
          >
            <q-item-section>Already have an account.</q-item-section>
          </q-item>

          <q-btn
            label="Sing up"
            type="submit"
            color="primary"
            :loading="loading"
            class="full-width q-mt-lg"
            :disable="!form.firstname || !form.lastname || !form.nickname || !form.email || !form.password || !form.password_repeated || form.password != form.password_repeated"
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
  name: 'RegisterPage',
  data () {
    return {
      form: {
        firstname: '',
        lastname: '',
        nickname: '',
        email: '',
        password: '',
        password_repeated: ''
      },
      showPassword: false
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/register', this.form).then(() => this.$router.push(this.redirectTo))
    }
  }
})
</script>
