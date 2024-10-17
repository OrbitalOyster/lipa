<script setup lang="ts">

import InputText from '../components/InputText.vue'
import MyButton from '../components/MyButton.vue'
import MyCheckbox from '../components/MyCheckbox.vue'
import MyCard from '../components/MyCard.vue'
import { ref } from 'vue'
import useLoginStore from '../stores/loginStore.ts'
import { useRouter } from 'vue-router'

const router = useRouter(),
  loginStore = useLoginStore(),
  username = ref(''),
  password = ref(''),
  // eslint-disable-next-line no-useless-assignment
  auth = async () => {
    const authRes = await loginStore.auth(username.value, password.value)
    if (authRes) {
      await router.push('/')
    }
    else { console.log('Login failed') }
  },
  year = new Date().getFullYear()

</script>

<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen">
    <MyCard class="w-1/3" title="LIPA" subtitle="Последний шанс снять бахилы">
      <form @submit.prevent="auth">
        <InputText class="w-full mb-3" name="username" v-model="username" placeholder="Имя пользователя" autofocus/>
        <InputText class="w-full" name="password" v-model="password" placeholder="Пароль"/>
        <div class="flex justify-between pt-4">
          <MyCheckbox title="Запомнить меня" form-id="rememberMe" form-name="rememberMe"/>
          <MyButton title="Войти" icon="arrow-right-to-bracket"/>
        </div>
      </form>
    </MyCard>
    <div class="p-2 w-1/3 text-end">
      (c) {{year}}
    </div>
  </div>
</template>
