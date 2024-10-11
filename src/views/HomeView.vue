<script setup lang="ts">
import { useRouter } from 'vue-router'
import useLoginStore from '../stores/loginStore.ts'

const loginStore = useLoginStore()
const router = useRouter()

const logout = async () => {
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
    <button
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>
