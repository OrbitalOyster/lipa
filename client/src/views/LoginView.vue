<script setup lang="ts">

import InputText from '../components/InputText.vue'
import MyButton from '../components/MyButton.vue'
import MyCard from '../components/MyCard.vue'
import MyCheckbox from '../components/MyCheckbox.vue'
import { ref } from 'vue'
import useLoginStore from '../stores/loginStore.ts'
import { useRouter } from 'vue-router'

const router = useRouter(),
  loginStore = useLoginStore(),
  username = ref(''),
  password = ref(''),
  rememberMe = ref(false),
  loading = ref(false),
  disabled = ref(false),
  // eslint-disable-next-line no-useless-assignment
  auth = async () => {
    loading.value = disabled.value = true
    const authRes = await loginStore.auth(username.value, password.value, rememberMe.value)
    if (authRes) {
      await router.push('/')
    }
    else { console.log('Login failed') }
    loading.value = disabled.value = false
  },
  // eslint-disable-next-line no-useless-assignment
  year = new Date().getFullYear()

</script>

<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen">
    <div class="w-1/3">
      <MyCard>
        <div class="pb-4">
          <img
            class="float-right w-14 h-14"
            src="/icon.svg"
          >
          <h1 class="text-3xl font-bold text-slate-600">
            Lipa
          </h1>
          <h2 class="text-lg text-slate-400">
            Последний шанс снять бахилы
          </h2>
        </div>
        <form @submit.prevent="auth">
          <InputText
            v-model="username"
            class="w-full mb-3"
            name="username"
            placeholder="Имя пользователя"
            autofocus
          />
          <InputText
            v-model="password"
            class="w-full"
            name="password"
            placeholder="Пароль"
            password
          />
          <div class="flex justify-between items-center pt-4">
            <MyCheckbox
              v-model="rememberMe"
              title="Запомнить меня"
              form-name="rememberMe"
            />
            <MyButton
              title="Войти"
              icon="arrow-right-to-bracket"
              submit
              :loading
              :disabled
            />
          </div>
        </form>
      </MyCard>
      <div class="p-2 text-end">
        (c) {{ year }}
      </div>
    </div>
  </div>
</template>
