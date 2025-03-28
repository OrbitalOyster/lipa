<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseMarkable from '#components/GooseMarkable.vue'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { watch } from 'vue'

export interface GooseTreeLeaf {
  id: string
  title: string
  checked: boolean
  toggled?: boolean
  match?: boolean
  sub?: GooseTreeLeaf[]
}

const props = defineProps<{
    checkable?: boolean
    checked: boolean | null
    search?: string
  }>(),
  emit = defineEmits(['match', 'check', 'select'])

const model = defineModel<GooseTreeLeaf[]>({ required: true })

function onMatchChildren(i: number) {
  /* TODO: Clunky */
  if (!model.value[i]?.sub)
    throw new Error('Major screwup')

  /* Any children matches search string */
  if (Object.values(model.value[i].sub).filter(l => l.match).length) {
    model.value[i].match = model.value[i].toggled = true
    emit('match', true)
  }
}

function onSelect(leaf: GooseTreeLeaf) {
  return 0
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
  if (value !== null)
    model.value.forEach(e => e.checked = value)
})

</script>

<template>
  <ul>
    <li
      v-for="(leaf, i) in model"
      :key="i"
    >
      <!-- Root node -->
      <div :style="{ display: leaf.match ? 'block' : 'none' }">
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
              :name="leaf.id"
              @update="value => leaf.checked = value"
            >
              <GooseMarkable
                :needle="search || ''"
                :title="leaf.title"
                tag="div"
                @update="value => {leaf.match = value; emit('match', value)}"
              />
            </GooseCheckbox>
          </div>
        </div>
        <!-- Children nodes -->
        <div :style="{ display: leaf.toggled ? 'block': 'none'}">
          <GooseTree
            v-if="leaf.sub"
            v-model="leaf.sub"
            :search
            :checkable
            :checked="leaf.checked"
            @match="onMatchChildren(i)"
            @check="value => leaf.checked = value"
            @select="title => emit('select', title)"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/style'
  @use '../assets/transitions'

  ul
    position: relative
    margin: .0rem
    overflow-y: auto
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
