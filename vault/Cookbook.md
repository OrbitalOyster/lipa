*Date: 9/02/2025*

Prerequisites:
- node.js (v23.7.0)
- npm (v11.1.0)

## Table of contents

* [[#Basic setup]]
* [[#Vite]]
* [[#Vue]]
* [[#Typescript]]
* [[#Path aliases]]
* [[#.env]]
* [[#ESLint]]
* [[#CSS]]
* [[#Favicon]]
* [[#Fonts]]
* [[#Font Awesome]]
## Basic setup

1. Create root folder
```bash
mkdir potato
cd potato
```

2. Create `package.json` file
```bash
touch package.json
```

```json
{
  "name": "potato",
  "version": "0.0.1",
  "type": "module"
}
```

## Vite

3. Install vite
```bash
npm add vite@6.1.0 -ED
```

`-E` saves exact package version (no "^" specifier)
`-D` saves package as developer dependency

[Vite docs](https://vite.dev/guide/)

4. Create `index.html` file
```bash
touch index.html
```

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Potato</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

1. Create `vite.config.ts` file, define http ports for development and previewing
```bash
touch vite.config.ts
```

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
  },
  preview: {
    port: 8080,
  },
})
```

2. Add `scripts` property to `package.json`, add vite scripts
```json
"scripts": {
  "dev": "vite --host",
  "preview": "vite preview --host",
  "build": "vite build"
}
```

3. Try running
```bash
npm run dev
```

![[1.png]]

## Vue

4. Install vue and vite plugin for vue
```bash
npm add vue@3.5.13 @vitejs/plugin-vue@5.2.1 -ED
```

[Vue docs](https://vuejs.org/guide/introduction.html)
[@vitejs/vite-plugin-vue github](https://github.com/vitejs/vite-plugin-vue/)

5. Add vue plugin to `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' /* New line */

export default defineConfig({
  server: {
    port: 8080,
  },
  preview: {
    port: 8080,
  },
  plugins: [vue()], /* New line */
})
```

6. Create `src` folder
```bash
mkdir src
```

7. Create `src/App.vue` file
```bash
touch src/App.vue
```

```html
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <h1>Hello, World!</h1>
  <button @click="count++">
    Click me
  </button>
  <p>{{ count }}</p>
</template>

<style scoped>
</style>
```

8. Create `src/main.ts` file
```bash
touch src/main.ts
```

```typescript
import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)
app.mount('#app')
```

9. Modify `index.html` to include `src/main.ts` and mount point
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Potato</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Typescript

10. Install typescript, vue type checking tool and recommended typescript config for vue
```bash
npm add typescript@5.7.3 vue-tsc@2.2.0 @vue/tsconfig@0.7.0 -ED
```

[vue-tsc github](https://github.com/vuejs/language-tools/tree/master/packages/tsc)
[@vue/tsconfig github](https://github.com/vuejs/tsconfig)

11. Create `tsconfig.json` file, extend it from recommended config, enable rules for linting
```bash
touch tsconfig.json
```

```json
{
  "extends": [
    "@vue/tsconfig/tsconfig.json"
  ],
  "compilerOptions": {
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "alwaysStrict": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true,
    "strictBindCallApply": true,
    "strictBuiltinIteratorReturn": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true
  }
}
```

12. Add npm script for type checking
```json
"scripts": {
  "dev": "vite --host",
  "preview": "vite preview --host",
  "build": "vite build",
  "typecheck": "vue-tsc"
}
```

## Path aliases

13. Add ``imports`` section to `package.json`
```json
"imports": {
  "#*": "./src/*"
}
```

Now instead of this:
```typescript
import MyButton from '../../components/MyButton.vue'
```
do this:
```typescript
import MyButton from '#components/MyButton.vue'
```

## .env

Vite handles .env files automatically

14. Create `.env` file, add environment variables
```
VITE_FOO=Hello
```

15. Create `src/vite-env.d.ts` file
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_FOO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

VITE_FOO is now exposed like this:
```typescript
console.log(import.meta.env.VITE_FOO) /* Hello */
```
## ESLint

16. Install: 
  * eslint ([docs](https://eslint.org/docs/latest/use/getting-started))
  * Official config for eslint + typescript + vue ([github](https://github.com/vuejs/eslint-config-typescript))
  * eslint vue plugin ([github](https://github.com/vuejs/eslint-plugin-vue))
  * eslint import/export plugin ([github](https://github.com/un-ts/eslint-plugin-import-x))
  * eslint import resolver ([github](https://github.com/import-js/eslint-import-resolver-typescript))
  * eslint stylistic plugin ([github](https://github.com/eslint-stylistic/eslint-stylistic))

```bash
npm add eslint@9.20.0 @vue/eslint-config-typescript@14.3.0 eslint-plugin-vue@9.32.0 eslint-plugin-import-x@4.6.1 eslint-import-resolver-typescript@3.7.0 @stylistic/eslint-plugin@3.1.0 -ED
```

17. Create `eslint.config.mjs` file, enable recommended rules
```bash
touch eslint.config.mjs
```

```js
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import eslintPluginImportX from 'eslint-plugin-import-x'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfigWithVueTs(
  { ignores: ['dist'] }, /* Ignore output folder */
  eslintPluginImportX.flatConfigs.recommended, /* Import plugin */
  pluginVue.configs['flat/recommended'], /* Vue plugin */
  stylistic.configs['recommended-flat'], /* Formatting */
  vueTsConfigs.recommendedTypeChecked, /* Main config */
  vueTsConfigs.stylisticTypeChecked,
  {
    rules: {
      'sort-imports': 'error',
      /* Replaced by typecheck */
      'no-unreachable': 'off',
      'no-unused-vars': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {},
      },
    },
  },
)
```

18. Add npm scripts for linting
```json
"scripts": {
  "dev": "vite --host",
  "preview": "vite preview --host",
  "build": "vite build",
  "typecheck": "vue-tsc",
  "lint": "eslint",
  "lint:fix": "eslint --fix"
},
```

Results so far:
![[2.png]]

## CSS

Vite supports sass out-of-the-box

19. Install sass
```bash
npm add sass@1.83.4 -ED
```

[Sass docs](https://sass-lang.com/documentation/)

20. Set `<style>` lang to "sass"
```html
<style scoped lang="sass">
$primary-color: blue

h1
  color: $primary-color
</style>
```

21. Install CSS normalizer
```bash
npm add normalize.css@8.0.1 -ED
```

22. Import it to `src/main.ts` file
```typescript
import 'normalize.css'
```

## Favicon

Vite exposes `public` folder

23. Create public folder, copy `favicon.ico` to it
```bash
mkdir public
```

Results so far:
![[3.png]]

## Fonts

24. To install sample font:
```bash
npm install @fontsource-variable/exo-2
```

([github](https://github.com/fontsource/fontsource))

25. To import it:
```typescript
import '@fontsource-variable/exo-2'
```

26. To use it:
```html
<style lang="sass">
p
  font-family: 'Exo 2 Variable'
</style>
```

## Font Awesome

27. Install free SVG icons and vue component
```bash
npm add @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/vue-fontawesome -D
```

28. Import Font Awesome Icon component and required icons
```typescript
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse'
```

29. To use:
```html
<FontAwesomeIcon :icon="faUser" />
```
