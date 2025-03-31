<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'
import GooseTree from '#components/GooseTree.vue'
import type { GooseTreeLeaf } from '#components/GooseTree.vue'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ref, watch, onMounted } from 'vue'
import type { Ref } from 'vue'

defineProps<{
  checkable?: boolean
  searchable?: boolean
}>()

const checked = ref(false),
  search = ref(''),
  model = defineModel<GooseTreeLeaf[]>({ required: true })

function leafMatched(leaf: GooseTreeLeaf) {
  leaf.matched = false

//  console.log('leafMatched', leaf)

  if (leaf.sub?.length) {
//    console.log('going down', leaf.sub.length)
    for (let i = 0; i < leaf.sub.length; i++) {
//      console.log('checking', i)
      if (leafMatched(leaf.sub[i]))
        leaf.matched = leaf.toggled = true
    }
  }

  if (leaf.title.indexOf(search.value) !== -1)
    leaf.matched = true

  return leaf.matched
}

watch(search, (after) => {
  // console.log('searched for', after)
//    console.log('checking', i, search.value, model.value[i].title, leafMatched(model.value[i]))
  for (let i = 0; i < model.value.length; i++)
    leafMatched(model.value[i])
})

onMounted(() => {
  for (let i = 0; i < model.value.length; i++) {
    leafMatched(model.value[i])
  }
  console.log(model)
})

</script>

<template>
  <GooseInput
    v-if="searchable"
    v-model="search"
    :icon="faMagnifyingGlass"
  />
  <GooseTree
    v-model="model"
    :checkable
    :checked="checked || false"
    :search
    style="padding-left: 0"
    @select="e => console.log(`selected ${e}`)"
  />
</template>

<style lang="sass" scoped>
</style>
