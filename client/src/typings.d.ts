declare module '*.vue' {
  import vue from 'vue'
  export default vue
}

interface ImportMeta {
  env: {
    VITE_AUTH_API: string
  }
}
