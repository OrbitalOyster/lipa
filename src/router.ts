import { createRouter, createWebHistory } from 'vue-router'
import AboutView from './views/AboutView.vue'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import useLoginStore from './stores/loginStore.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { component: HomeView, name: 'Home', path: '/' },
    { component: AboutView, name: 'About', path: '/about' },
    { component: LoginView, name: 'Login', path: '/login' },
  ],
})

router.beforeEach(async (to, from) => {
  console.log(`Navigating from ${from.path} to ${to.path}`)

  const loggedIn = await useLoginStore().check()

  // Except login page
  if (to.name === 'Login') {
    // Logged in users get redirected
    return loggedIn ? { name: 'Home' } : true
  }

  return loggedIn ? true : { name: 'Login' }
})

export default router
