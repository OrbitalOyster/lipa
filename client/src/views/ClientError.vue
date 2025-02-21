<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter(),
    err = router.options.history.state['err']
</script>

<template>
  <div v-if="err" class="fs centered">
    <div class="card" style="padding: 1rem; width: fit-content">
      <h1>Ах, какая досада...</h1>
      <hr/>
      <strong>
      <p>
          Что-то пошло не так. Просьба не паниковать.
          В настоящий момент подробности выясняются, а виновные подвергаются швабрированию.
      </p>
      <p>
        Чтобы ускорить процесс, сообщите следующие страшные слова ответственным лицам:
      </p>
      </strong>
      <pre>{{err?.message}}</pre>
      <pre>{{err?.stack}}</pre>
      <strong>Для облегчения боли бытия был вызван танцующий гусь</strong>
      <div class="centered">
        <img src='/error.gif'/>
      </div>
      <hr/>
      <RouterLink to="/">
        Вернуться на главную страницу
      </RouterLink>
    </div>
  </div>
  <div v-else>
    Здесь нет ошибки. Возможно, её и не было
  </div>
</template>

<style lang="sass">
  h1
    margin: 0
</style>
