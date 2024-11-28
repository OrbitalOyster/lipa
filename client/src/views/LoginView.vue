<script setup lang="ts">

import { ref, useTemplateRef } from 'vue'
import InputText from '@components/InputText.vue'
import MyButton from '@components/MyButton.vue'
import MyCard from '@components/MyCard.vue'
import MyCheckbox from '@components/MyCheckbox.vue'
import MyForm from '@components/MyForm.vue'
import MyShakeable from '@components/base/MyShakeable.vue'
import { useLoginStore } from '@stores/loginStore.ts'
import { useRouter } from 'vue-router'

interface ILoginFormCheck {
  username: string
  password: string
  rememberMe: boolean
}

interface IMyShakeable extends InstanceType<typeof MyShakeable> {
  shake(): Promise<void>
}

const router = useRouter(),
  loginStore = useLoginStore(),
  shakeable = useTemplateRef<IMyShakeable>('shakeable'),
  loading = ref(false),
  disabled = ref(false),
  // eslint-disable-next-line no-useless-assignment
  auth = async (formCheck: ILoginFormCheck | null) => {
    if (!formCheck) {
      return
    }
    loading.value = true
    disabled.value = true
    if (await loginStore.auth(formCheck.username, formCheck.password, formCheck.rememberMe)) {
      await router.push('/')
    }
    else {
      await shakeable.value?.shake()
    }
    loading.value = false
    disabled.value = false
  },
  // eslint-disable-next-line no-useless-assignment
  year = new Date().getFullYear()
</script>

<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen">
    <MyShakeable
      ref="shakeable"
      class="w-1/3"
    >
      <MyCard
        title="Lipa"
        subtitle="Последний шанс снять бахилы"
        icon="goose.png"
      >
        <MyForm
          id="loginForm"
          @submit="auth"
        >
          <InputText
            class="w-full mb-3"
            name="username"
            store-id="loginForm"
            :checks="['required']"
            placeholder="Имя пользователя"
            :disabled
            autofocus
          />
          <InputText
            class="w-full"
            name="password"
            store-id="loginForm"
            :checks="['required']"
            placeholder="Пароль"
            :disabled
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
    </MyShakeable>
  </div>
</template>
