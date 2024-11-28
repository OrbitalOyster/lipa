<script setup lang="ts">
import MyButton from '@components/MyButton.vue'
import { useLoginStore } from '@stores/loginStore.ts'
import { useRouter } from 'vue-router'

const loginStore = useLoginStore(),
  router = useRouter(),
  // eslint-disable-next-line no-useless-assignment
  logout = async () => {
    await loginStore.logout()
    await router.push('/login')
  }
</script>

<template>
  <div class="text-lg p-4 space-y-1">
    <p>Вы зашли как: <strong> {{ loginStore.username }} </strong> </p>
    <p>Роль: <strong> {{ loginStore.role }} </strong> </p>
    <div class="flex justify-end pt-2">
      <MyButton
        title="Выйти"
        icon="right-from-bracket"
        @click="logout"
      />
    </div>
  </div>
</template>
