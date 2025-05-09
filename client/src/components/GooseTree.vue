<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseMarkable from '#components/GooseMarkable.vue'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { watch } from 'vue'

const props = defineProps<{
    checkable?: boolean
    search?: string
  }>(),
  emit = defineEmits(['check', 'select']),
  model = defineModel<GooseTreeLeaf[]>({ required: true }),
  branch = model.value

function branchIsIndetermitate(b) {
  const f = b[0]
//  console.log(b, b[0])
  for (let i = 1; i < b.length; i++) {
    const leaf = b[i]
    if (leaf.checked !== f.checked) {
      return true
    }
    if (leaf.sub && branchIsIndetermitate(leaf.sub)) {
      return true
    }

  }
  return false
}

function onSelect(leaf: GooseTreeLeaf) {
  return
  if (!leaf.sub)
    emit('select', leaf.title)
  else
    leaf.toggled = !leaf.toggled
}

function checkBranch(branch: GooseTreeLeaf[], value: boolean) {
  branch.forEach((leaf) => {
    leaf.checked = value
    if (leaf.sub)
      checkBranch(leaf.sub, value)
  })
}

branch.forEach(leaf =>
  watch(() => leaf.checked, () => {
    /* Check/uncheck all leaves when root is checked/unchecked */
    if (leaf.sub && !branchIsIndetermitate(leaf.sub))
      checkBranch(leaf.sub, leaf.checked)
    /* Everything checked */
    if (branch.some(l => l.checked === true))
      emit('check', true)
    /* Nothing checked */
    else if (branch.every(l => l.checked === false))
      emit('check', false)
    /* So-so */
    // else emit('check', 'indeterminate')
  },
  ),
)

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
              :indeterminate="leaf.sub && branchIsIndetermitate(leaf.sub)"
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
        <Transition name="slide">
          <GooseTree
            v-if="leaf.sub && leaf.toggled"
            v-model="leaf.sub"
            :search
            :checkable
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
    flex-shrink: 0
    height: 1rem
    transition: transform 100ms
    width: 2rem

  .toggled
    transform: rotate(90deg)
</style>
