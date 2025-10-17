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
      sideBar: useLocalStorage('sidebar', ''),
      sideBarToggled: useLocalStorage('sidebar-toggled', true),
      tab: useLocalStorage('tab', 'initial'),
      fromDate: useLocalStorage('from-date', currentMonth.fromDate),
      toDate: useLocalStorage('to-date', currentMonth.toDate),
      pageSizes, /* TODO: Here? */
      reportsPageSize: useLocalStorage('reports-pagination-size', 10),
      reportsPage: useLocalStorage('reports-page', 0),
      reportsSortBy: useLocalStorage('reports-sort-by', 'date'),
      reportsSortDesc: useLocalStorage('reports-sort-desc', false),
      templatesPage: useLocalStorage('templates-page', 0),
      templatesPageSize: useLocalStorage('templates-pagination-size', 10),
      templatesSortBy: useLocalStorage('templates-sort-by', 'date'),
      templatesSortDesc: useLocalStorage('templates-sort-desc', false),
    }
  },
})

export { useLocalSettings }
