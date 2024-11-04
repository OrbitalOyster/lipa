<script setup lang="ts">
import MyButton from '../components/MyButton.vue'
</script>

<template>
  <main>

    <div class="flex items-center justify-center w-screen h-screen bg-white/50 fixed backdrop-blur-sm">
      <div class="flex flex-col bg-white p-3 border border-slate-300 rounded drop-shadow">
        <div class="flex flex-row items-center">
          <font-awesome-icon
            class="text-amber-500 p-4"
            :icon="['fas', 'triangle-exclamation']"
            size="3x"
          />
          <p class="p-1"> Are you sure you want to log out?</p>
        </div>
        <footer class="flex justify-end pt-3 space-x-2 border-t">
          <MyButton title="Yes" icon="check"/>
          <MyButton title="No" icon="multiply"/>
        </footer>
      </div>
    </div>

    <div>
      About page
      <img
        src="/icon.svg"
      >
      <RouterLink to="/">
        back
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>

</style>
