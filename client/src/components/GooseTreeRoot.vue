<script setup lang="ts">
import GooseInput from '#components/GooseInput.vue'
import GooseTree from '#components/GooseTree.vue'
import type { Leaf } from '#components/GooseTree.vue'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

defineProps<{
  checkable?: boolean
  searchable?: boolean
}>()

const checked = ref(false),
  search = ref(''),
  model = defineModel<Leaf[]>({ required: true })

</script>

<template>
  <GooseInput
    v-if="searchable"
    v-model="search"
    :icon="faMagnifyingGlass"
    style="padding-bottom: 1rem"
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
