<script setup>
  import MyButton from '../components/MyButton.vue' 
  import MyPopover from '../components/MyPopover.vue'

  import { ref } from 'vue'
  import {useFloating, offset, autoUpdate,arrow, flip,shift, computePosition} from '@floating-ui/vue'
  const reference = ref(null)
  const floating = ref(null)
  const floatingArrow = ref(null)

  const {floatingStyles, middlewareData} = useFloating(reference, floating, { 
    placement: 'bottom',
    middleware: [offset(12), shift(), arrow({element: floatingArrow})],
    whileElementsMounted: autoUpdate,
    }
  )

</script>

<template>
  <div class="flex w-screen h-screen items-center justify-center">
    <main>
      <h1>Testing grounds</h1> 
      <MyButton ref="reference" title="Button" />
      <MyPopover ref="floating" :style="floatingStyles">
        <p>Hello World!</p>
        <div
          ref="floatingArrow"
          class="arrow"
          :style="{
            left:
              middlewareData.arrow?.x != null
                ? `${middlewareData.arrow.x}px`
                : '-9px',
            top:
              middlewareData.arrow?.y != null
                ? `${middlewareData.arrow.y}px`
                : '-9px',
          }"
        ></div> 
      </MyPopover>
    </main>
  </div>
</template>

<style scoped>
  main {
    @apply w-64 h-64 bg-sky-200 p-4;
  } 

  .arrow {
    @apply absolute w-4 h-4 rotate-45 bg-white;
    @apply border-slate-300 border-t border-l;
  }
</style>
