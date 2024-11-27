declare module '*.vue' {
  import * as vue from 'vue'
  export default vue
}

interface ImportMeta {
  env: {
    VITE_AUTH_API: string
  }
}
