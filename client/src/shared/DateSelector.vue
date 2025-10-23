<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GooseButton from '#components/GooseButton.vue'
import GoosePopupMenu from '#components/GoosePopupMenu.vue'
import GooseTooltip from '#components/GooseTooltip.vue'
import { dateToPeriod } from '#composables/useDateTimeUtils.ts'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

const fromDate = defineModel<string>('fromDate', { required: true }),
  toDate = defineModel<string>('toDate', { required: true }),
  emit = defineEmits(['update']),
  showPopup = ref(false),
  timePeriods = [
    { id: 'currentMonth', title: 'Текущий месяц' },
    { id: 'previousMonth', title: 'Предыдущий месяц' },
    { id: 'today', title: 'Сегодня' },
    { id: 'yesterday', title: 'Вчера' },
    { id: 'fromJan1', title: 'С начала года' },
  ],
  selectedPeriod = ref(timePeriods[0]!.id)

function setDate(period: Period) {
  const now = new Date()
  fromDate.value = dateToPeriod(now, period).fromDate
  toDate.value = dateToPeriod(now, period).toDate
  emit('update')
}

function checkDate() {
  const fromDateNum = Date.parse(fromDate.value),
    toDateNum = Date.parse(toDate.value)
  const result
    = !isNaN(fromDateNum) && !isNaN(toDateNum) && fromDateNum <= toDateNum
  return result
}

const dateValid = computed(checkDate)

watch([fromDate, toDate], () => checkDate() && emit('update'))
</script>

<template>
  <GooseTooltip
    :text="dateValid ? '' : 'Некорректная дата'"
    side="top"
  >
    <input
      v-model="fromDate"
      class="calendar"
      :class="{ invalid: !dateValid }"
      type="date"
      :max="toDate"
      title=""
    >
    -
    <input
      v-model="toDate"
      class="calendar"
      :class="{ invalid: !dateValid }"
      type="date"
      :min="fromDate"
      title=""
    >
  </GooseTooltip>
  <GoosePopupMenu
    v-model="selectedPeriod"
    :active="showPopup"
    :items="timePeriods"
    @update="
      (d) => {
        showPopup = false;
        setDate(d);
      }
    "
  >
    <GooseButton
      :icon="faEllipsisVertical"
      tooltip="Выбрать дату"
      transparent
      color="primary"
      @click="showPopup = !showPopup"
      @blur="showPopup = false"
    />
  </GoosePopupMenu>
</template>

<style lang="sass" scoped>
@use '../assets/borders'
@use '../assets/colors'
@use '../assets/transitions'

.calendar
  background-color: colors.$input-background
  border-radius: borders.$radius
  border: 1px solid colors.$input-border
  box-sizing: border-box
  color: colors.$text
  font: inherit
  height: 2.5rem
  min-width: 10rem
  outline: colors.$outline solid 0px
  padding: .25rem .5rem .25rem .75rem
  transition: transitions.$focusable, transitions.$colors

.calendar:focus
  border-color: colors.$outline
  outline-width: borders.$focus-outline-width

.invalid
  background-color: colors.$input-invalid-background
  border: 1px solid colors.$input-invalid-border
</style>
