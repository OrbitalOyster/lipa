import { createRouter, createWebHistory } from 'vue-router'
import ClientError from '#views/ClientError.vue'
import HomeView from '#views/HomeView.vue'
import LoginView from '#views/LoginView.vue'
import TestView from '#views/TestView.vue'
import { useUserStore } from '#stores/useUserStore.ts'

/* Typings */
declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

/* Routes */
const routes = [{
  component: LoginView,
  name: 'Login',
  path: '/login',
  meta: { title: 'Вход' },
}, {
  component: HomeView,
  name: 'Home',
  path: '/',
  meta: { title: 'Главная' },
}, {
  component: TestView,
  name: 'Test',
  path: '/test',
  meta: { title: 'Test' },
}, {
  component: ClientError,
  name: 'Error',
  path: '/error',
  meta: { title: 'Ошибка' },
}]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* Error handler */
router.onError(async (err, to) => {
  console.log('Router error', err, to)
  await router.push({ name: 'Error' })
})

/* Auth guards */
router.beforeEach(async (to, from) => {
  console.log(`Navigating from ${from.path} to ${to.path}`)
  /* Error page */
  if (to.name === 'Error')
    return true
  /* Log in status */
  const loggedIn = await useUserStore().check()
  if (to.name === 'Login')
    /* Logged in users get redirected from login page to home page */
    return loggedIn ? { name: 'Home' } : true
  /* Default handler */
  return loggedIn ? true : { name: 'Login' }
})

/* Set document title */
router.afterEach(to => document.title = `${to.meta.title} - Gooseberry.js`)

export default router
