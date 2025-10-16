import { dateToPeriod } from '#composables/useDateTimeUtils.ts'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const pageSizes = [
  { id: 10, title: '10' },
  { id: 25, title: '25' },
  { id: 50, title: '50' },
  { id: 100, title: '100' },
]

const useLocalSettings = defineStore('settings', {
  state: () => {
    const currentMonth = dateToPeriod(new Date(), 'currentMonth')
    return {
      fromDate: useLocalStorage('from-date', currentMonth.fromDate),
      toDate: useLocalStorage('to-date', currentMonth.toDate),
      pageSizes,
      pageSize: useLocalStorage('pagination-size', 10),
      sideBar: useLocalStorage('sidebar', ''),
      sideBarToggled: useLocalStorage('sidebar-toggled', true),
      tab: useLocalStorage('tab', 'initial'),
    }
  },
})

export { useLocalSettings }
