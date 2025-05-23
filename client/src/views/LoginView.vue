<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseCheckbox from '#components/GooseCheckbox.vue'
import GooseForm from '#components/GooseForm.vue'
import GooseFormInput from '#components/GooseFormInput.vue'
import GooseToggle from '#components/GooseToggle.vue'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '#stores/useUserStore.ts'

const router = useRouter(),
  userStore = useUserStore(),
  disabled = ref(false),
  username = ref(''),
  password = ref(''),
  rememberMe = ref(false),
  usernameError = ref(''),
  passwordError = ref(''),
  loginAsUser = ref(false)

async function auth() {
  disabled.value = true
  if (await userStore.auth(username.value, password.value, rememberMe.value))
    await router.push('/')
  else
    console.log('failed')
  disabled.value = false
}

</script>

<template>
  <div class="fs centered">
    <div>
      <GooseForm
        @submit="!usernameError && !passwordError && auth()"
      >
        <main class="card">
          <header>
            <div class="title">
              <h1>Gooseberry.js</h1>
              <h2>Последний шанс снять бахилы</h2>
            </div>
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
            <div style="display: flex; flex-direction: column; gap: 1rem">
              <GooseCheckbox
                v-model="rememberMe"
                :disabled
              >
                <div>Запомнить меня</div>
              </GooseCheckbox>
              <GooseToggle
                v-model="loginAsUser"
                :disabled
              >
                <div>Вход с логином</div>
              </GooseToggle>
            </div>
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

<style scoped lang="sass">
  main
    display: flex
    flex-direction: column
    gap: 1rem
    height: fit-content
    min-width: 32rem
    padding: 1rem
    width: fit-content

  header
    align-items: center
    display: flex
    gap: 1rem
    justify-content: space-between

  .title
    display: flex
    flex-direction: column
    gap: .5rem

  h1
    font-size: 2rem
    font-weight: 500
    margin: .0rem

  h2
    font-size: 1rem
    font-weight: 500
    margin: .0rem

  img
    border-radius: 100%
    height: 4rem
    width: 4rem

  .inputs
    display: flex
    flex-direction: column
    gap: 1rem

  footer
    align-items: center
    display: flex
    justify-content: space-between

  .copyright
    display: flex
    justify-content: end
    padding: .75rem
</style>
