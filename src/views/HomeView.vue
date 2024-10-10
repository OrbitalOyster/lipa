<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()
const logoutEndpoint = `${import.meta.env.VITE_AUTH_API}/logout`
const logout = async () => {
  await axios.get(logoutEndpoint)
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
