<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseMarkable from '#components/GooseMarkable.vue'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { watch } from 'vue'

const props = defineProps<{
    checkable?: boolean
    selectable?: boolean
    search?: string
  }>(),
  emit = defineEmits(['check', 'select']),
  branch = defineModel<TreeLeaf[]>({ required: true })

/* Check if leaf children has mixed check states */
function leafIsIndetermitate(leaf: TreeLeaf): boolean {
  /* Not a branch */
  if (!leaf.sub[0])
    return false
  const first = leaf.sub[0].checked
  return leaf.sub.some(l => l.checked !== first || leafIsIndetermitate(l))
}

function onSelect(leaf: TreeLeaf) {
  if (!leaf.sub.length)
    emit('select', leaf.title)
  else
    leaf.opened = !leaf.opened
}

function checkBranch(branch: TreeLeaf[], value: boolean) {
  branch.forEach((leaf) => {
    leaf.checked = value
    if (leaf.sub.length)
      checkBranch(leaf.sub, value)
  })
}

branch.value.forEach(leaf =>
  watch(() => leaf.checked, () => {
    /* Check/uncheck all leaves when root is checked/unchecked */
    if (leaf.sub.length) {
      /* TODO: Make sence of it */
      if (!leaf.checked || !leafIsIndetermitate(leaf))
        checkBranch(leaf.sub, leaf.checked)
    }
    /* Emit up */
    emit('check', branch.value.some(l => l.checked))
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
</script>

<template>
  <ul>
    <li
      v-for="(leaf, i) in branch"
      :key="i"
    >
      <!-- Root node -->
      <div v-if="search === '' || leafMatched(leaf)">
        <div
          class="title"
          :class="{ 'selectable-title': selectable }"
          :style="{ 'padding-left': leaf.sub.length ? 0 : '2.0rem' }"
          @click="selectable && onSelect(leaf)"
        >
          <!-- Open/close leaf icon (disabled when searching) -->
          <FontAwesomeIcon
            v-if="leaf.sub.length"
            class="chevron"
            :class="{ opened: leaf.opened }"
            :icon="faChevronRight"
            @click.stop="search === '' && (leaf.opened = !leaf.opened)"
          />
          <!-- Checkbox -->
          <GooseCheckbox
            v-if="checkable"
            v-model="leaf.checked"
            :indeterminate="leafIsIndetermitate(leaf)"
          >
            <GooseMarkable
              :needle="search || ''"
              :title="leaf.title"
              tag="div"
            />
          </GooseCheckbox>
          <!-- Regular title -->
          <GooseMarkable
            v-else
            :needle="search || ''"
            :title="leaf.title"
            tag="div"
          />
        </div>
        <!-- Children nodes -->
        <Transition _name="slide">
          <GooseTree
            v-if="leaf.sub.length && leaf.opened"
            v-model="leaf.sub"
            :search
            :checkable
            :selectable
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
    gap: .0rem
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
    flex-shrink: 0
    transition: transform 100ms
    width: 2rem

  .opened
    transform: rotate(90deg)
</style>
