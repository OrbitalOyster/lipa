<script setup lang="ts">
import MyButton from '../components/MyButton.vue'
</script>

<template>
  <main>

    <div class="flex flex-col items-center justify-center w-screen h-screen bg-white/50 fixed backdrop-blur-sm">
      <div class="flex bg-white p-2 border rounded">
        <div>
          <p> Are you sure you want to log out?</p>
          <font-awesome-icon
            class="text-sky-500"
            :icon="['fas', 'circle-info']"
            size="2x"
          />
          <footer class="flex w-full space-x-2">
            <MyButton title="Yes"/>
            <MyButton title="No"/>
          </footer>
        </div>
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
