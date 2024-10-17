<script setup lang="ts">

import InputText from '../components/InputText.vue'
import MyButton from '../components/MyButton.vue'
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
  }

</script>

<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <MyCard class="w-1/3" title="LIPA" subtitle="Последний шанс снять бахилы">
      <form @submit.prevent="auth">
        <InputText class="w-full mb-3" name="username" v-model="username" placeholder="Имя пользователя" autofocus/>
        <InputText class="w-full" name="password" v-model="password" placeholder="Пароль"/>
        <MyButton title="Войти"/>
        <br>
      </form>
    </MyCard>
  </div>
</template>
