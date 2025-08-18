<script setup lang="ts">
import GooseButton from '#components/GooseButton.vue'
import GoosePopupMenu from '#components/GoosePopupMenu.vue'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

const fromDate = defineModel<string>('fromDate', { required: true }),
  toDate = defineModel<string>('toDate', { required: true }),
  emit = defineEmits(['update']),
  showPopup = ref(false),
  extraDates = [
    { id: 'currentMonth', title: 'Текущий месяц' },
    { id: 'previousMonth', title: 'Предыдущий месяц' },
    { id: 'today', title: 'Сегодня' },
    { id: 'yesterday', title: 'Вчера' },
    { id: 'fromJan1', title: 'С начала года' },
  ],
  selectedExtraDate = ref(extraDates[0]!.id)

function dateToYYYMMDD(d: Date) {
  const offset = d.getTimezoneOffset(),
    zeroDate = new Date(d.getTime() - offset * 60 * 1000) /* Hatred */
  return zeroDate.toISOString().substr(0, 10)
}

function setDate(d: ExtraDate) {
  const now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth(),
    day = now.getDate()

  switch (d) {
    case 'currentMonth':
      fromDate.value = dateToYYYMMDD(new Date(year, month, 1))
      toDate.value = dateToYYYMMDD(new Date(year, month + 1, 0))
      break

    case 'previousMonth':
      fromDate.value = dateToYYYMMDD(new Date(year, month - 1, 1))
      toDate.value = dateToYYYMMDD(new Date(year, month, 0))
      break

    case 'today':
      fromDate.value = dateToYYYMMDD(new Date(year, month, day))
      toDate.value = fromDate.value
      break

    case 'yesterday':
      fromDate.value = dateToYYYMMDD(new Date(year, month, day - 1))
      toDate.value = fromDate.value
      break

    case 'fromJan1':
      fromDate.value = dateToYYYMMDD(new Date(year, 0, 1))
      toDate.value = dateToYYYMMDD(new Date(year, month, day))
      break
  }

  emit('update')
}
</script>

<template>
  <input
    v-model="fromDate"
    class="calendar"
    type="date"
    :max="toDate"
    @change="emit('update')"
  >
  -
  <input
    v-model="toDate"
    class="calendar"
    type="date"
    :min="fromDate"
    @change="emit('update')"
  >
  <GoosePopupMenu
    v-model="selectedExtraDate"
    :active="showPopup"
    :items="extraDates"
    @update="d => { showPopup=false; setDate(d)}"
  >
    <GooseButton
      :icon="faEllipsisVertical"
      tooltip="Выбрать дату"
      tooltip-side="right"
      small
      transparent
      @click="showPopup = !showPopup"
    />
  </GoosePopupMenu>
</template>
