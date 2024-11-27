declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

interface ImportMeta {
  env: {
    VITE_AUTH_API: string
  }
}

/* TODO: Workaround */
interface MyShakeable {
  shake(): Promise<void>
}
