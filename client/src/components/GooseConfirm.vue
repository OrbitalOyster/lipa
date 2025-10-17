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
  dialog = useTemplateRef('dialog'),
  altTitle = ref('')

const { activate, deactivate } = useFocusTrap(dialog, {
  /* On escape */
  escapeDeactivates: () => {
    active.value = false
    return true
  },
})

async function show(newAltTitle?: string) {
  active.value = true
  if (newAltTitle)
    altTitle.value = newAltTitle
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
        class="confirm-wrapper"
      >
        <div
          ref="dialog"
          class="dialog"
        >
          <div class="message">
            <FontAwesomeIcon
              :icon="faTriangleExclamation"
              size="3x"
            />
            {{ altTitle || title }}
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
  @use '../assets/borders'
  @use '../assets/colors'
  @use '../assets/transitions'

  .confirm-wrapper
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
</style>
