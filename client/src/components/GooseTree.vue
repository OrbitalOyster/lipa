<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseMarkable from '#components/GooseMarkable.vue'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { watch } from 'vue'

const props = defineProps<{
    checkable?: boolean
    checked: boolean | null
    search?: string
  }>(),
  emit = defineEmits(['check', 'select']),
  model = defineModel<GooseTreeLeaf[]>({ required: true })

function onSelect(leaf: GooseTreeLeaf) {
  return
  if (!leaf.sub)
    emit('select', leaf.title)
  else
    leaf.toggled = !leaf.toggled
}

/* Emit up */
watch(() => model.value.map(l => l.checked), (after) => {
  /* Everything checked */
  if (after.every(e => e === true))
    emit('check', true)
  /* Nothing checked */
  else if (after.every(e => e === false))
    emit('check', false)
  /* So-so */
  else
    emit('check', null)
})

/* Emit down */
watch(() => props.checked, (value: boolean | null) => {
  /* Check/uncheck all leaves when root is checked/unchecked */
  if (value !== null) /* Ignore the middle ground */
    model.value.forEach(e => e.checked = value)
})

/* Show leaf if any children matched (recursive) or leaf title itself */
function leafMatched(leaf: GooseTreeLeaf) {
  const titleMatched = leaf.title.includes(props.search ?? ''),
    childrenMatched = leaf.sub?.some(leafMatched)
  leaf.toggled = childrenMatched!
  return titleMatched || childrenMatched
}

</script>

<template>
  <ul>
    <li
      v-for="(leaf, i) in model"
      :key="i"
    >
      <!-- Root node -->
      <div v-if="search === '' || leafMatched(leaf)">
        <div
          :class="['title', '_selectable-title']"
          :style="{ 'padding-left': leaf.sub ? 0 : '2.5rem' }"
          @click="onSelect(leaf)"
        >
          <FontAwesomeIcon
            v-if="leaf.sub"
            :class="{ chevron: true, toggled: leaf.toggled }"
            :icon="faChevronRight"
            @click.stop="leaf.toggled = !leaf.toggled"
          />
          <!-- Checkbox -->
          <div v-if="checkable">
            <GooseCheckbox
              v-model="leaf.checked"
              @update="value => leaf.checked = value"
            >
              <GooseMarkable
                :needle="search || ''"
                :title="leaf.title"
                tag="div"
              />
            </GooseCheckbox>
          </div>
        </div>
        <!-- Children nodes -->
        <Transition name="bounce">
          <GooseTree
            v-if="leaf.sub && leaf.toggled"
            v-model="leaf.sub"
            :search
            :checkable
            :checked="leaf.checked"
            @check="value => leaf.checked = value"
            @select="title => emit('select', title)"
          />
        </Transition>
      </div>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/style'
  @use '../assets/transitions'

  ul
    margin: .0rem
    padding: .0rem .0rem .0rem 1.75rem

  li
    display: block
    padding: .0rem .0rem .0rem .0rem
    user-select: none

  .title
    align-items: center
    display: flex
    gap: .5rem
    height: fit-content
    min-height: 3rem

  .selectable-title
    cursor: pointer

  .selectable-title:hover
    background-color: #EAECEE

  .selectable-title:selected
    background-color: #D5D8DC

  .chevron
    cursor: pointer
    height: 1rem
    padding: .0rem
    margin-right: .5rem
    margin-left: .5rem
    transition: transform 100ms
    width: 1rem

  .toggled
    transform: rotate(90deg)
</style>
