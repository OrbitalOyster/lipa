<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseForm from '#components/GooseForm.vue'
import GooseFormInput from '#components/GooseFormInput.vue'
import GooseSwitch from '#components/GooseSwitch.vue'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useAnimate } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useUserStore } from '#stores/useUserStore.ts'

const router = useRouter(),
  userStore = useUserStore(),
  disabled = ref(false),
  main = useTemplateRef('main'),
  username = ref(''),
  password = ref(''),
  rememberMe = ref(false),
  usernameError = ref(''),
  passwordError = ref(''),
  loginAsUser = ref(false)

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
  if (await userStore.auth(username.value, password.value, rememberMe.value))
    await router.push('/')
  else
    shake()
  disabled.value = false
}

</script>

<template>
  <div class="login-view-wrapper">
    <div>
      <GooseForm
        @submit="!usernameError && !passwordError && auth()"
      >
        <main ref="main">
          <header>
            <hgroup>
              <h1>Gooseberry.js</h1>
              <h2>Последний шанс снять бахилы</h2>
            </hgroup>
            <img src="/goose.webp">
          </header>
          <GooseFormInput
            v-model="username"
            :checks="['required', 'notBogus']"
            :disabled
            autocomplete="username"
            autofocus
            placeholder="Имя пользователя"
            @validated="err => usernameError = err"
          />
          <GooseFormInput
            v-model="password"
            :checks="['required']"
            :disabled
            autocomplete="password"
            password
            placeholder="Пароль"
            @validated="err => passwordError = err"
          />
          <footer>
            <GooseCheckbox
              v-model="rememberMe"
              :disabled
            >
              <div>Запомнить меня</div>
            </GooseCheckbox>
            <GooseSwitch
              v-model="loginAsUser"
              :disabled
            >
              <div>Вход с логином</div>
            </GooseSwitch>
            <GooseButton
              :disabled
              :loading="disabled"
              :icon="faRightToBracket"
              submit
              title="Войти"
            />
          </footer>
        </main>
      </GooseForm>
      <div class="copyright">
        <span>
          <FontAwesomeIcon :icon="faCopyright" />
          {{ new Date().getFullYear() }}
        </span>
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
    gap: 1rem
    height: fit-content
    margin-bottom: .25rem
    min-width: 32rem
    padding: 1rem
    width: fit-content

  header
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between

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
    width: 4rem

  footer
    align-items: center
    display: flex
    justify-content: space-between

  .copyright
    display: flex
    justify-content: end
    padding: .5rem
</style>
