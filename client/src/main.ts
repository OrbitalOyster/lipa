import 'normalize.css'
import '#icons.ts'
import '@fontsource-variable/exo-2'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.ts'

const app = createApp(App),
  pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
