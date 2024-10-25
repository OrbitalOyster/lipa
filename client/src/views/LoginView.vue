<script setup lang="ts">

import InputText from '../components/InputText.vue'
import MyForm from '../components/MyForm.vue'
import MyButton from '../components/MyButton.vue'
import MyCard from '../components/MyCard.vue'
import MyCheckbox from '../components/MyCheckbox.vue'
import { ref } from 'vue'
import { useLoginStore } from '../stores/loginStore.ts'
import { useRouter } from 'vue-router'

const router = useRouter(),
  loginStore = useLoginStore(),
  rememberMe = ref(false),
  loading = ref(false),
  disabled = ref(false),
  // eslint-disable-next-line no-useless-assignment
  auth = async (formCheck) => {
    if (!formCheck)
      return
    loading.value = true
    disabled.value = true
    const authRes = await loginStore.auth(formCheck.username, formCheck.password, formCheck.rememberMe)
    if (authRes) {
      await router.push('/')
    }
    else { console.log('Login failed') }
    loading.value = false
    disabled.value = false
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
        <MyForm id="loginForm" @submit="auth">
          <InputText
            class="w-full mb-3"
            name="username"
            store-id="loginForm"
            :checks="['required']"
            placeholder="Имя пользователя"
            autofocus
          />
          <InputText
            class="w-full"
            name="password"
            store-id="loginForm"
            :checks="['required']"
            placeholder="Пароль"
            password
          />
          <div class="flex justify-between items-center pt-4">
            <MyCheckbox
              title="Запомнить меня"
              name="rememberMe"
              store-id="loginForm"
            />
            <MyButton
              title="Войти"
              icon="arrow-right-to-bracket"
              submit
              :loading
              :disabled
            />
          </div>
        </MyForm>
      </MyCard>
      <div class="p-2 text-end">
        (c) {{ year }}
      </div>
    </div>
  </div>
</template>
