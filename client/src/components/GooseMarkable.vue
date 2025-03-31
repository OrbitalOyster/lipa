<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  title: string
  needle: string
  tag: string
}>()

let s1 = '', p = '', s2 = ''

function update(needle: string) {
  const found = props.title.indexOf(needle)
  if (found !== -1) {
    s1 = props.title.slice(0, found)
    p = needle
    s2 = props.title.slice(found + needle.length)
  }
  else {
    s1 = props.title
    p = s2 = ''
  }
}

watch(props, newProps => update(newProps.needle))
update(props.needle)
</script>

<template>
  <component :is="tag">
    {{ s1 }}<mark>{{ p }}</mark>{{ s2 }}
  </component>
</template>
