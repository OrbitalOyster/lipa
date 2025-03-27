<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  title: string
  needle: string
  tag: string
}>()

const emit = defineEmits(['update'])

let s1 = '', p = '', s2 = '', status = false

function update(needle: string) {
  const found = props.title.indexOf(needle)
  if (found !== -1) {
    status = true
    s1 = props.title.slice(0, found)
    p = needle
    s2 = props.title.slice(found + needle.length)
  }
  else {
    status = false
    s1 = props.title
    p = s2 = ''
  }
  emit('update', status)
}

watch(props, newProps => update(newProps.needle))
update(props.needle)
</script>

<template>
  <component :is="tag">
    {{ s1 }}<mark v-if="status">{{ p }}</mark>{{ s2 }}
  </component>
</template>
