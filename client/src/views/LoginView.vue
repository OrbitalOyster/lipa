<script setup lang="ts">

import { ref } from 'vue'
import useLoginStore from '../stores/loginStore.ts'
import { useRouter } from 'vue-router'

const router = useRouter(),
  loginStore = useLoginStore(),
  username = ref(''),
  password = ref(''),
  // eslint-disable-next-line no-useless-assignment
  auth = async () => {
    const authRes = await loginStore.auth(username.value, password.value)
    if (authRes) {
      await router.push('/')
    }
    else { console.log('Login failed') }
  }

</script>

<template>
  <div>
    <h1 class="text-3xl font-bold underline">
      Login page
    </h1>
    <form @submit.prevent="auth">
      <input
        v-model="username"
        type="text"
        name="username"
        autofocus
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
