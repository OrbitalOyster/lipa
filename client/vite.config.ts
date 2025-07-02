import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const env = loadEnv('development', process.cwd()),
  port = Number(env['VITE_DEV_PORT'])

export default defineConfig({
  server: {
    port,
  },
  plugins: [vue()],
  build: {
    target: 'esnext',
  },
})
