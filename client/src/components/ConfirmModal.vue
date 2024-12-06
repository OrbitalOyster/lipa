<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import MyButton from '@components/MyButton.vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
defineProps<{
  title: string
}>()
// eslint-disable-next-line no-useless-assignment
const emit = defineEmits(['submit']),
  active = ref(false),
  dialog = useTemplateRef('dialog'),
  onEsc = () => {
    active.value = false
    return true
  },
  { activate, deactivate } = useFocusTrap(dialog, { escapeDeactivates: onEsc }),
  show = async () => {
    active.value = true
    await nextTick()
    activate()
  },
  // eslint-disable-next-line no-useless-assignment
  hide = () => {
    active.value = false
    deactivate()
  }
defineExpose({ show })
</script>

<template>
  <Teleport to="#modals">
    <Transition name="fade">
      <div
        v-if="active"
        class="fixed w-screen h-screen flex items-center justify-center bg-white/75 z-50"
      >
        <div
          ref="dialog"
          class="card p-4 m-4"
        >
          <div class="flex flex-row items-center pb-2">
            <font-awesome-icon
              class="text-amber-500"
              :icon="['fas', 'triangle-exclamation']"
              size="3x"
            />
            <p class="p-4">
              {{ title }}
            </p>
          </div>
          <footer class="flex justify-end pt-4 space-x-2 border-t">
            <MyButton
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
