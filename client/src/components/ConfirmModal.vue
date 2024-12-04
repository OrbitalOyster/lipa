<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import MyButton from '@components/MyButton.vue'

defineProps<{
  title: string
}>()

// eslint-disable-next-line no-useless-assignment
const emit = defineEmits(['submit']),
  isActive = ref(false),
  okButton = useTemplateRef('okButton'),
  show = async () => {
    isActive.value = true
    await nextTick()
    okButton.value?.focus()
  },
  // eslint-disable-next-line no-useless-assignment
  hide = () => {
    isActive.value = false
  }

defineExpose({ show })
</script>

<template>
  <Teleport to="#modals">
    <Transition name="fade">
      <div
        v-if="isActive"
        class="flex items-center justify-center w-screen h-screen bg-white/75 fixed z-50"
        @click="hide"
      >
        <div
          class="card p-4"
          @click.stop
          @keyup.esc="hide"
        >
          <div class="flex flex-row items-center pb-2">
            <font-awesome-icon
              class="text-amber-500 p-2"
              :icon="['fas', 'triangle-exclamation']"
              size="3x"
            />
            <p class="p-1">
              {{ title }}
            </p>
          </div>
          <footer class="flex justify-end pt-3 space-x-2 border-t">
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
    </Transition>
  </Teleport>
</template>
