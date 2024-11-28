import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/'),
      '@stores': path.resolve(__dirname, './src/stores/'),
      '@views': path.resolve(__dirname, './src/views/'),
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
