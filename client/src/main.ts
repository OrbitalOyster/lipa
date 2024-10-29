import './style.css'
import './animations.css'
import { faArrowRightToBracket, faEye, faEyeSlash, faSpinner, faTriangleExclamation, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import router from './router.ts'

const app = createApp(App),
  pinia = createPinia()

app.use(pinia)
app.use(router)
library.add(faArrowRightToBracket, faEye, faEyeSlash, faSpinner, faTriangleExclamation, faAngleDown)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
