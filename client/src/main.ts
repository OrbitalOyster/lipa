import './style.css'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { faArrowRightToBracket, faEye } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import router from './router.ts'

const app = createApp(App),
  pinia = createPinia()

app.use(pinia)
app.use(router)
library.add(faArrowRightToBracket)
library.add(faEye)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
