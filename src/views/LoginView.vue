<script setup lang="ts">

import { useLoginStore } from '../stores/loginStore.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')

const loginStore = useLoginStore()

const auth = async () => {
  const authRes = await loginStore.auth(username.value, password.value)
  if (authRes)
    await router.push('/')
  else
    console.log('Login failed')
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
