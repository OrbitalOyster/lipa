<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import MyButton from '../components/MyButton.vue'

const root = useTemplateRef('root')
const backdrop = useTemplateRef('backdrop')
const isActive = ref(false)

const alertButton = useTemplateRef('alertButton')

const okButton = useTemplateRef('okButton')

const show = () => {
  isActive.value = true
  alertButton.value.blur()
  okButton.value.focus()
}

const hide = () => {
  isActive.value = false
}
</script>

<template>
  <main>

    <div ref="root" :class="{ root: true, 'opacity-0': !isActive, 'opacity-100': isActive, 'pointer-events-none': !isActive }" >
      <div ref="backdrop" class="backdrop" @click="hide">
        <div tabindex=0 :class="{ card: true }" @click.stop @keyup.esc="hide">
          <div class="flex flex-row items-center">
            <font-awesome-icon
              class="text-amber-500 p-4"
              :icon="['fas', 'triangle-exclamation']"
              size="3x"
            />
            <p class="p-1"> Are you sure you want to log out?</p>
          </div>
          <footer class="flex justify-end pt-3 space-x-2 border-t">
            <MyButton ref="okButton" title="Yes" icon="check"/>
            <MyButton title="No" icon="multiply" @click="hide"/>
          </footer>
        </div>
      </div>
    </div>

    <div>
      <h1> About page </h1>
      <MyButton ref="alertButton" title="Alert" @click="show" />
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
  .root {
    @apply z-50 absolute;
    @apply duration-200;
  }

  .backdrop {
    @apply flex items-center justify-center w-screen h-screen bg-white/75 fixed;
  }

  .card {
    @apply outline-none flex flex-col bg-white p-3 border border-slate-300 rounded drop-shadow;
  }
</style>
