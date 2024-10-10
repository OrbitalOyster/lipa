import App from './App.vue'
import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'

import { useLoginStore } from './stores/loginStore.ts'
import AboutView from './views/AboutView.vue'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/about', name: 'About', component: AboutView },
    { path: '/login', name: 'Login', component: LoginView },
  ],
})

// Auth check
router.beforeEach(async (to, from) => {
  const loginStore = useLoginStore()
  const loggedIn = await loginStore.check()

  // Except login page
  if (to.name === 'Login') {
    // Logged in users get redirected
    if (loggedIn)
      return { name: 'Home' }
    return true
  }

  console.log({ loggedIn })

  if (!loggedIn)
    return { name: 'Login' }

  console.log(`Navigated from ${from.path} to ${to.path}`)
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
