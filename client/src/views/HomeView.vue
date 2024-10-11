<script setup lang="ts">
import useLoginStore from '../stores/loginStore.ts'
import { useRouter } from 'vue-router'

const loginStore = useLoginStore(),
  router = useRouter(),
  // eslint-disable-next-line no-useless-assignment
  logout = async () => {
    await loginStore.logout()
    await router.push('/login')
  }

</script>

<template>
  <div>
    <h1>Home page</h1>
    <RouterLink to="/login">
      Login
    </RouterLink>
    <br>
    <RouterLink to="/about">
      About
    </RouterLink>
    <br>
    <button @click="logout">
      Logout
    </button>
  </div>
</template>
