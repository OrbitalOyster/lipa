import '@fontsource-variable/golos-text'
import '@fontsource-variable/exo-2'
import App from './App.vue'
import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.ts'
import { useUserStore } from '#stores/useUserStore.ts'

/* Most important part first */
const apiEndpoint = import.meta.env.VITE_API_URI
if (!apiEndpoint)
  throw new Error('Missing API endpoint')

const app = createApp(App),
  pinia = createPinia()

/* Always send cookies with axios */
axios.defaults.withCredentials = true
/* Always use same API */
axios.defaults.baseURL = apiEndpoint

app.use(router)
app.use(pinia)

await useUserStore().getPayload().catch(err => err)

app.mount('#app')
