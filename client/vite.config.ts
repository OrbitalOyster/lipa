import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/components'),
      '@stores': resolve(__dirname, './src/stores'),
      '@views': resolve(__dirname, './src/views'),
    },
  },
  plugins: [vue()],
  server: {
    port: 8080,
  },
  preview: {
    port: 8080,
  },
})
