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
router.beforeEach((to, from) => {
  // Except login page
  if (to.name === 'Login') {
    return true
  }

  const loginStore = useLoginStore()

  if (loginStore.username)
    console.log('Auth ok')
  else {
    // TODO: Send login check
  }

  console.log(`Navigated from ${from.path} to ${to.path}`)
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
