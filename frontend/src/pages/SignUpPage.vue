<template>
  <q-page padding class="full-height full-width row justify-center items-center q-pa-sm">
    <q-card class="col-12 q-pa-md q-mb-lg" style="max-width: 400px;">
      <q-card-section>
        <div class="text-h6">Sign Up</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" ref="loginForm">
          <q-input
            v-model="firstname"
            label="First name"
            type="text"
            :rules="[val => !!val || 'First name is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="lastname"
            label="Last name"
            type="text"
            :rules="[val => !!val || 'Last name is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="nickname"
            label="Nickname"
            type="text"
            :rules="[val => !!val || 'Nickname is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            class="q-mb-md"
            outlined
          />

          <q-input
            v-model="password_repeated"
            label="Repeat password"
            type="password"
            :rules="[val => !!val || 'Password repeat is required']"
            outlined
          />

          <q-item
            clickable :to="{ path: '/login' }"
            class="q-mt-md"
          >
            <q-item-section>Already have an account.</q-item-section>
          </q-item>

          <q-btn
            label="Sing up"
            type="submit"
            color="primary"
            class="full-width q-mt-lg"
            :disable="!firstname || !lastname || !nickname || !email || !password || !password_repeated || password != password_repeated"
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
  name: 'SignUpPage',

  mounted () {
    this.$store.commit('main/setUser', null)
  },

  data () {
    return {
      firstname: '',
      lastname: '',
      nickname: '',
      email: '',
      password: '',
      password_repeated: '',
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
