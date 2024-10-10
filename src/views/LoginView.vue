<script setup lang="ts">

import axios, { AxiosResponse, AxiosError } from 'axios'
import { useLoginStore } from '../stores/loginStore.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface AuthResponse {
  username: string
  role: string
}

const username = ref(null)
const password = ref(null)

const authEndpoint = `${import.meta.env.VITE_AUTH_API}/auth`

const auth = async () => {
  await axios.post(
    authEndpoint, {
      username: username.value,
      password: password.value,
    }, {
      withCredentials: true,
    },
  ).then(async (res: AxiosResponse<AuthResponse | null>) => {
    if (res.data !== null) {
      const loginStore = useLoginStore()
      loginStore.auth(res.data.username, res.data.role)
      console.log('Login ok')
      await router.push('/')
    }
    else {
      console.log('Login failed')
    }
  }).catch((err: unknown) => {
    console.error('XHR error:', (<AxiosError>err).message)
  })
}

</script>

<template>
  <div>
    Login page
    <form @submit.prevent="auth">
      <input
        v-model="username"
        type="text"
      >
      <input
        v-model="password"
        type="password"
      >
      <button type="submit">
        Войти
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>
