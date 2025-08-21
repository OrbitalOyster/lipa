<script setup lang="ts">
import GooseTooltip from '#components/GooseTooltip.vue'
</script>

<template>
  <div class="logo-wrapper">
    <GooseTooltip
      text="Да, это гусь"
      side="bottom"
    >
      <img src="/goose.webp">
    </GooseTooltip>
    <h1>
      <RouterLink
        to="/"
        class="title"
      >
        Gooseberry.js
      </RouterLink>
    </h1>
  </div>
</template>

<style lang="sass" scoped>
  @use '../assets/colors'

  .logo-wrapper
    align-items: center
    display: flex
    flex-shrink: 0
    gap: 1rem
    height: 4rem

  img
    border-radius: 100%
    height: 4rem
    box-shadow: 0px 0px 3px 2px
    width: 4rem

  h1
    display: inline
    font-size: 2rem
    font-weight: 400
    margin-block: 1rem

  .title
    color: colors.$text
</style>
