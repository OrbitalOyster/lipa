<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import GooseButton from '#components/GooseButton.vue'
import { faMultiply } from '@fortawesome/free-solid-svg-icons'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

defineProps<{
  title: string
  closeButton?: boolean
  cancelButton?: boolean
}>()

const active = ref(false),
  emit = defineEmits(['close']),
  dialog = useTemplateRef('dialog')

const { activate, deactivate } = useFocusTrap(dialog, {
  /* On escape */
  escapeDeactivates: () => {
    active.value = false
    return true
  },
})

async function show() {
  active.value = true
  await nextTick()
  activate()
}

function hide() {
  active.value = false
  deactivate()
  emit('close')
}

defineExpose({ show })
</script>

<template>
  <Teleport to="#modals">
    <Transition name="fade">
      <div
        v-if="active"
        class="modal-wrapper"
      >
        <div
          ref="dialog"
          class="dialog"
        >
          <header>
            <h1>
              {{ title }}
            </h1>
            <GooseButton
              v-if="closeButton"
              :icon="faMultiply"
              transparent
              @click="hide"
            />
          </header>
          <slot />
          <footer>
            <GooseButton
              v-if="cancelButton"
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
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .modal-wrapper
    align-items: center
    background-color: rgba(255, 255, 255, .8)
    display: flex
    height: 100vh
    justify-content: center
    position: fixed
    width: 100vw
    z-index: 100

  .dialog
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    display: flex
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    flex-direction: column
    gap: 1rem
    margin-bottom: .25rem
    padding: 1rem

  header
    align-items: center
    border-bottom: borders.$card
    display: flex
    justify-content: space-between
    padding-bottom: 1rem

  h1
    font-size: 1.5rem

  footer
    display: flex
    justify-content: end
    gap: 1rem
</style>
