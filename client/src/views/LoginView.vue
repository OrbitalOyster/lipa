<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseForm from '#components/GooseForm.vue'
import GooseFormInput from '#components/GooseFormInput.vue'
import GooseSwitch from '#components/GooseSwitch.vue'
import type { Ref } from 'vue'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useAnimate } from '@vueuse/core'
import useFetchOrgs from '#composables/useFetchOrgs.ts'
import { useRouter } from 'vue-router'
import { useUserStore } from '#stores/useUserStore.ts'

const router = useRouter(),
  userStore = useUserStore(),
  disabled = ref(false),
  loadingOrgs = ref(true),
  main = useTemplateRef('main'),
  usernameRef = useTemplateRef('usernameRef'),
  orgRef = useTemplateRef('orgRef'),
  orgs: Ref<SelectItem[]> = ref([]),
  org = ref(''),
  passwordRef = useTemplateRef('passwordRef'),
  username = ref(''),
  password = ref(''),
  rememberMe = ref(false),
  loginAsOrg = ref(true)

/* Auth fail animation */
const { play: shake } = useAnimate(main, [
  { transform: 'translate(0, 0) rotate(0deg)' },
  { transform: 'translate(-1px, 1px) rotate(-2deg)' },
  { transform: 'translate(2px, 2px) rotate(3deg)' },
  { transform: 'translate(-2px, -2px) rotate(-3deg)' },
  { transform: 'translate(2px, -2px) rotate(0deg)' },
  { transform: 'translate(2px, 2px) rotate(-3deg)' },
  { transform: 'translate(-2px, -2px) rotate(0deg)' },
  { transform: 'translate(1px, 1px) rotate(2deg)' },
  { transform: 'translate(0, 0) rotate(0deg)' },
], { immediate: false, duration: 400 })

async function auth() {
  disabled.value = true
  const isOrg = loginAsOrg.value,
    userId = isOrg ? org.value : username.value
  if (await userStore.auth(userId, isOrg, password.value, rememberMe.value))
    await router.push('/')
  else
    shake()
  disabled.value = false
}

onMounted(async () => {
  const apiOrgs = await useFetchOrgs()
  orgs.value = apiOrgs.map(o => ({
    id: o.id,
    title: `${o.id} - ${o.name}`,
  }))
  loadingOrgs.value = false
})
</script>

<template>
  <div class="login-view-wrapper">
    <div>
      <GooseForm @submit="usernameRef?.error || orgRef?.error || passwordRef?.error || auth()">
        <main ref="main">
          <header>
            <hgroup>
              <h1>Gooseberry.js</h1>
              <h2>Последний шанс снять бахилы</h2>
            </hgroup>
            <img src="/goose.webp">
          </header>
          <!-- Log in as organization -->
          <GooseFormInput
            v-if="loginAsOrg"
            ref="orgRef"
            v-model="org"
            :checks="['required']"
            :disabled="disabled || loadingOrgs"
            :items="orgs"
            :loading="loadingOrgs"
            placeholder="Организация"
            tag="select"
          />
          <!-- Log in as user -->
          <GooseFormInput
            v-else
            ref="usernameRef"
            v-model="username"
            :checks="['required', 'notBogus']"
            :disabled
            autocomplete="username"
            placeholder="Имя пользователя"
            tooltip="Логин латинскими символами"
            tooltip-side="left"
            tag="input"
          />
          <!-- Password -->
          <GooseFormInput
            ref="passwordRef"
            v-model="password"
            :checks="['required']"
            :disabled
            autocomplete="current-password"
            name="password"
            password
            placeholder="Пароль"
            tag="input"
            tooltip="Без римских цифр"
          />
          <footer>
            <GooseCheckbox
              v-model="rememberMe"
              :disabled
            >
              <div>Запомнить меня</div>
            </GooseCheckbox>
            <GooseSwitch
              v-model="loginAsOrg"
              :disabled
            >
              <div>Войти как организация</div>
            </GooseSwitch>
            <GooseButton
              :disabled="disabled || loadingOrgs"
              :icon="faRightToBracket"
              :loading="disabled"
              submit
              title="Войти"
              tooltip="А ещё можно нажать на Enter"
              tooltip-side="right"
            />
          </footer>
        </main>
      </GooseForm>
      <div class="copyright">
        <FontAwesomeIcon
          :icon="faCopyright"
          size="lg"
        />
        {{ new Date().getFullYear() }}
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/borders'
  @use '../assets/colors'

  .login-view-wrapper
    align-items: center
    display: flex
    height: 100vh
    justify-content: center
    position: fixed
    width: 100vw

  main
    background-color: colors.$card
    border-radius: borders.$radius
    border: borders.$card
    display: flex
    filter: drop-shadow(colors.$card-shadow 0 .1rem .1rem)
    flex-direction: column
    gap: .5rem
    height: fit-content
    margin-bottom: .25rem
    min-width: 36rem
    padding: .75rem

  header
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between
    padding: .5rem

  hgroup
    display: flex
    flex-direction: column
    gap: .5rem

  h1
    font-size: 2rem
    font-weight: 500

  h2
    font-size: 1rem
    font-weight: 500

  img
    border-radius: 100%
    height: 4rem
    box-shadow: 0px 0px 2px 1px
    width: 4rem

  footer
    align-items: center
    display: flex
    justify-content: space-between
    margin-top: .5rem

  .copyright
    align-items: center
    display: flex
    gap: .2rem
    justify-content: end
    padding: .5rem
</style>
