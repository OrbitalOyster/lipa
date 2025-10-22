import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const useLocalSettings = defineStore('settings', {
  state: () => {
    return {
      sideBar: useLocalStorage('sidebar', ''),
      sideBarToggled: useLocalStorage('sidebar-toggled', true),
      tab: useLocalStorage('tab', 'initial'),
    }
  },
})

export { useLocalSettings }
