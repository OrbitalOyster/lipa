<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseMarkable from '#components/GooseMarkable.vue'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { watch } from 'vue'

const props = defineProps<{
  search?: string
}>(),
  emit = defineEmits(['toggle']),
  branch = defineModel<TreeLeaf[]>({ required: true })

/* Check if leaf children have mixed toggle states */
function leafIsIndetermitate(leaf: TreeLeaf): boolean {
  /* Not a branch */
  if (!leaf.sub[0])
    return false
  const first = leaf.sub[0].toggled
  return leaf.sub.some(l => l.toggled !== first || leafIsIndetermitate(l))
}

function toggleBranch(branch: TreeLeaf[], value: boolean) {
  branch.forEach((leaf) => {
    leaf.toggled = value
    if (leaf.sub.length)
      toggleBranch(leaf.sub, value)
  })
}

branch.value.forEach(leaf =>
  watch(() => leaf.toggled, () => {
    /* Toggle all leaves when root is toggled */
    if (leaf.sub.length) {
      /* TODO: Make sence of it */
      if (!leaf.toggled || !leafIsIndetermitate(leaf))
        toggleBranch(leaf.sub, leaf.toggled)
    }
    /* Emit up */
    emit('toggle', branch.value.some(l => l.toggled))
  },
  ),
)

/* Show leaf if any children matched (recursive) or leaf title itself */
function leafMatched(leaf: TreeLeaf) {
  const titleMatched = leaf.title.includes(props.search ?? ''),
    childrenMatched = leaf.sub.some(leafMatched)
  leaf.opened = childrenMatched!
  return titleMatched || childrenMatched
}

function toggleAll(value: boolean) {
  toggleBranch(branch.value, value)
}

function toggleSome(branch: TreeLeaf[], ids: string[], value: boolean) {
  branch.forEach((leaf) => {
    if (ids.includes(leaf.id))
      leaf.toggled = value
    if (leaf.sub.length)
      toggleSome(leaf.sub, ids, value)
  })
}

defineExpose({ toggleAll, toggleSome: (ids: string[], value: boolean) => toggleSome(branch.value, ids, value) })
</script>

<template>
  <ul>
    <li
      v-for="(leaf, i) in branch"
      :key="i"
    >
      <!-- Root node -->
      <div v-show="search === '' || leafMatched(leaf)">
        <div
          class="title"
          :style="{ 'padding-left': leaf.sub.length ? 0 : '2.0rem' }"
        >
          <!-- Open/close leaf icon (disabled when searching) -->
          <FontAwesomeIcon
            v-show="leaf.sub.length"
            class="chevron"
            :class="{ opened: leaf.opened }"
            :icon="faChevronRight"
            @click.stop="search === '' && (leaf.opened = !leaf.opened)"
          />
          <!-- Checkbox -->
          <GooseCheckbox
            v-model="leaf.toggled"
            :indeterminate="leafIsIndetermitate(leaf)"
          >
            <GooseMarkable
              :needle="search || ''"
              :title="leaf.title"
              tag="div"
            />
          </GooseCheckbox>
        </div>
        <!-- Children nodes -->
        <Transition _name="slide">
          <GooseTree
            v-show="leaf.sub.length && leaf.opened"
            v-model="leaf.sub"
            :search
            @toggle="value => leaf.toggled = value"
          />
        </Transition>
      </div>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
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
    height: fit-content
    min-height: 3rem

  /* Shevron icon */
  .chevron
    cursor: pointer
    flex-shrink: 0
    transition: transform 100ms
    width: 2rem

  .chevron.opened
    transform: rotate(90deg)
</style>
