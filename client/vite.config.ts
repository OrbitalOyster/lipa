import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    port: 8080,
  },
  preview: {
    port: 80,
  },
  plugins: [vue()],
})
