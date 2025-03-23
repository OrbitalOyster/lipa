import 'normalize.css'
import '#icons.ts'
import '@fontsource-variable/exo-2'
import App from './App.vue'
import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.ts'
import { useUserStore } from '#stores/useUserStore.ts'

const app = createApp(App),
  pinia = createPinia()

// Always send cookies with axios
axios.defaults.withCredentials = true

app.use(router)
app.use(pinia)

await useUserStore().getPayload().catch(err => err)

app.mount('#app')
