<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  autofocus: Boolean,
  password: Boolean,
})
// eslint-disable-next-line no-useless-assignment
const model = defineModel<string>()

const togglePassword = () => {
  console.log("Toggle password")
}
</script>

<template>
  <div>
    <input
      v-model="model"
      :autofocus
      :placeholder
      class="w-full p-2"
      :type="password ? 'password' : 'text'"
    >
    <span v-if="password" @click="togglePassword">
      <font-awesome-icon
        class="text-slate-600"
        :icon="['fas', 'eye']"
        size="lg"
      />
    </span>
  </div>
</template>

<style scoped>
  input {
    /* Border */
    @apply outline-none border border-slate-300 rounded;
    @apply bg-slate-50;
    /* On focus */
    @apply focus:outline-2 focus:outline-emerald-400;
    /* Animations */
    @apply transition-all duration-200;
  }

  span {
    position: absolute;
    right: 1rem;
    padding: .5rem;
    cursor: pointer;
  }
</style>
