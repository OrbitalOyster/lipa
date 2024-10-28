declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

interface ImportMeta {
  env: {
    VITE_AUTH_API: string
  }
}

interface MyCard {
  shake(): Promise<void>
}
