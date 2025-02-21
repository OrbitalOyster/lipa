<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter(),
    err = router.options.history.state.err,
    message = err.message,
    stack = err.stack
</script>

<template>
  <div class="fs-centered">
    <h1>Ах, какая досада...</h1>
    <h3>Что-то пошло не так. Просьба не паниковать. В настоящий момент виновные подвергаются швабрированию</h3>
    <p>{{message}}</p>
    <pre>{{stack}}</pre>
  </div>
</template>
