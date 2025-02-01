<script setup lang="ts">
import { faCheck, faMultiply, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { nextTick, ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

defineProps<{
  title: string
}>()

const emit = defineEmits(['submit']),
  active = ref(false),
  dialog = useTemplateRef('dialog')

function onEsc() {
  active.value = false
  return true
}

const { activate, deactivate } = useFocusTrap(dialog, { escapeDeactivates: onEsc })

async function show() {
  active.value = true
  await nextTick()
  activate()
}

function hide() {
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
        class="fs centered backdrop"
      >
        <div
          ref="dialog"
          class="card dialog"
        >
          <div class="message">
            <FontAwesomeIcon
              :icon="faTriangleExclamation"
              size="3x"
            />
            {{ title }}
          </div>
          <footer>
            <GooseButton
              title="Ok"
              :icon="faCheck"
              @click="emit('submit'); hide()"
            />
            <GooseButton
              title="Отмена"
              :icon="faMultiply"
              @click="hide"
            />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'
  @use '../assets/transitions'

  .dialog
    display: flex
    flex-direction: column
    gap: 1rem
    padding: 1rem

  .message
    align-items: center
    display: flex
    flex-direction: row
    gap: 2rem

  .fa-triangle-exclamation
    color: colors.$warning

  footer
    display: flex
    justify-content: end
    gap: 1rem
</style>
