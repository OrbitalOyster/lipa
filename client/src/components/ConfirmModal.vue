<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import MyButton from '@components/MyButton.vue'

defineProps<{
  title: string
}>()

// eslint-disable-next-line no-useless-assignment
const emit = defineEmits(['submit']),
  isActive = ref(false),
  okButton = useTemplateRef<HTMLElement>('okButton'),
  show = () => {
    isActive.value = true
    if (!okButton.value) {
      throw new Error('Major screwup')
    }
    okButton.value.focus()
  },
  // eslint-disable-next-line no-useless-assignment
  hide = () => {
    isActive.value = false
  }

defineExpose({ show })
</script>

<template>
  <Teleport to="#modals">
    <main
      :class="{ 'opacity-0': !isActive, 'opacity-100': isActive, 'pointer-events-none': !isActive }"
    >
      <div
        class="backdrop"
        @click="hide"
      >
        <div
          tabindex="0"
          class="card"
          @click.stop
          @keyup.esc="hide"
        >
          <div class="flex flex-row items-center pb-2">
            <font-awesome-icon
              class="text-amber-500 p-4"
              :icon="['fas', 'triangle-exclamation']"
              size="3x"
            />
            <p class="p-1">
              {{ title }}
            </p>
          </div>
          <footer>
            <MyButton
              ref="okButton"
              title="Ok"
              icon="check"
              @click="emit('submit'); hide()"
            />
            <MyButton
              title="Отмена"
              icon="multiply"
              @click="hide"
            />
          </footer>
        </div>
      </div>
    </main>
  </Teleport>
</template>

<style scoped>
  main {
    @apply z-50 absolute;
    @apply duration-200;
  }

  .backdrop {
    @apply flex items-center justify-center w-screen h-screen bg-white/75 fixed;
  }

  .card {
    @apply outline-none flex flex-col bg-white p-3 border border-slate-300 rounded drop-shadow;
  }

  footer {
    @apply flex justify-end pt-3 space-x-2 border-t;
  }
</style>
