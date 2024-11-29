import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '@views/AboutView.vue'
import type { Component } from 'vue'
import ErrorView from '@views/ErrorView.vue'
import ExampleFormView from '@views/ExampleFormView.vue'
import HomeView from '@views/HomeView.vue'
import LoginView from '@views/LoginView.vue'
import TestingGrounds from '@views/TestingGrounds.vue'
import { useLoginStore } from '@stores/loginStore.ts'

/* Typings */
declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

/* Routes */
const routes = [{
    component: LoginView as Component,
    name: 'Login',
    path: '/login',
    meta: { title: 'Вход' },
  }, {
    component: HomeView as Component,
    name: 'Home',
    path: '/',
    meta: { title: 'Главная' },
  }, {
    component: AboutView,
    name: 'About',
    path: '/about',
    meta: { title: 'О программе' },
  }, {
    component: ExampleFormView as Component,
    name: 'ExampleForm',
    path: '/form',
    meta: { title: 'Example Form' },
  }, {
    component: ErrorView as Component,
    name: 'Error',
    path: '/error',
    meta: { title: 'Ошибка' },
  }, {
    component: TestingGrounds as Component,
    name: 'Test',
    path: '/test',
    meta: { title: 'Test' },
  },
  ],
  router = createRouter({
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
  if (to.name === 'Error') {
    return true
  }
  /* Login page */
  const loggedIn = await useLoginStore().check()
  if (to.name === 'Login') {
    /* Logged in users get redirected to home page */
    return loggedIn ? { name: 'Home' } : true
  }
  /* Default handler */
  return loggedIn ? true : { name: 'Login' }
})

router.afterEach((to) => {
  /* Set document title */
  document.title = `Lipa / ${to.meta.title}`
})

export default router
