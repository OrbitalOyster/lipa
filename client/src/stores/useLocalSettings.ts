import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const pageSizes = [
    { id: 10, title: '10' },
    { id: 25, title: '25' },
    { id: 50, title: '50' },
    { id: 100, title: '100' },
  ]
  
const useLocalSettings = defineStore('settings', {
  state: () => ({
    fromDate: useLocalStorage('from-date', '2025-01-01'),
    toDate:  useLocalStorage('to-date', '2025-01-31'),
    pageSizes,
    pageSize: useLocalStorage('pagination-size', 10),
  })
})

export { useLocalSettings }
