<script setup lang="ts">
import { useLoginStore } from '../stores/loginStore.ts'
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
  <div class="space-y-1">
    <h1>Home page</h1>
    <div>
      <RouterLink to="/login">
        Login
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/form">
        Form
      </RouterLink>
    </div>
    <div>
      <RouterLink to="/about">
        About
      </RouterLink>
    </div>
    <div>
      <button @click="logout">
        Logout
      </button>
    </div>
  </div>
</template>
