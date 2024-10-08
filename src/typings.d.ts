declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

interface ImportMeta {
  env: {
    VITE_SOME_FOO: string
  }
}
