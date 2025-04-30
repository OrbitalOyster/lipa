<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GooseButton from '#components/GooseButton.vue'
import GooseForm from '#components/GooseForm.vue'
import GooseFormCheckbox from '#components/GooseFormCheckbox.vue'
import GooseFormInput from '#components/GooseFormInput.vue'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'vue-router'
import { useUserStore } from '#stores/useUserStore.ts'

const router = useRouter(),
  userStore = useUserStore(),
  disabled = ref(false),
  loginFormRef = useTemplateRef('loginForm')

async function auth(formCheck: LoginFormCheck | null) {
  if (!formCheck)
    return
  disabled.value = true
  if (await userStore.auth(formCheck.username, formCheck.password, formCheck.rememberMe))
    await router.push('/')
  else
    console.log('failed')
  disabled.value = false
}

onMounted(() =>
  loginFormRef.value?.setInputs({
    username: 'foo', password: 'bar', rememberMe: false,
  }),
)
</script>

<template>
  <div class="fs centered">
    <div>
      <GooseForm
        ref="loginForm"
        :inputs="['username', 'password']"
        @submit="auth"
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
            :checks="['required', 'notBogus']"
            :disabled
            autocomplete="username"
            autofocus
            name="username"
            placeholder="Имя пользователя"
          />
          <GooseFormInput
            :checks="['required']"
            :disabled
            autocomplete="password"
            name="password"
            password
            placeholder="Пароль"
          />
          <footer>
            <GooseFormCheckbox
              :disabled
              name="rememberMe"
            >
              <div>Запомнить меня</div>
            </GooseFormCheckbox>
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
