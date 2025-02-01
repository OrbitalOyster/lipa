*Date: 25/12/2024*

Prerequisites:
- node.js (v23.4.0)
- npm (v11.0.0)

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
npm add vite@6.0.5 -ED
```

`-E` saves exact package version (no "^" specifier)
`-D` saves package as developer dependency

[Vite docs](https://vite.dev/guide/)

4. Create `index.html` file
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

5. Create `vite.config.ts` file, fill in ports
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
  },
  preview: {
    port: 8081,
  },
})
```

6. Add `scripts` property to `package.json`, add vite scripts
```json
"scripts": {
  "dev": "vite --host",
  "preview": "vite preview --host",
  "build": "vite build",
},
```

7. Try running
```bash
npm run dev
```

![[1.png]]

## Vue

8. Install vue and vite plugin for vue
```bash
npm add vue@3.5.13 @vitejs/plugin-vue@5.2.1 -ED
```

[Vue docs](https://vuejs.org/guide/introduction.html)

9. Add vue plugin to `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' /* New line */

export default defineConfig({
    server: {
    port: 8080,
  },
  preview: {
	port: 8081,
  },
  plugins: [vue()], /* New line */
})
```

10. Create `src` folder
```bash
mkdir src
```

11. Create `src/App.vue` file
```html
<script setup lang="ts">
  import { ref } from 'vue'
  const count = ref(0)
</script>

<template>
  <h1>Hello, World!</h1>
  <button @click="count++">Click me</button>
  <p>{{count}}</p>
</template>

<style scoped>
</style>
```

12. Create `src/main.ts` file
```typescript
import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)
app.mount('#app')
```

13. Modify `index.html` to include `src/main.ts` and mount point
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

Typescript v5.7.2 is incompatible with vue ([bug ticket](https://github.com/vuejs/language-tools/issues/5018))

14. Install typescript@5.6.3, vue type checking tool and recommended typescript config for vue
```bash
npm add typescript@5.6.3 vue-tsc@2.2.0 @vue/tsconfig@0.7.0 -ED
```

[@vue/tsconfig github](https://github.com/vuejs/tsconfig)

15. Create `tsconfig.json` file, extend it from recommended config, enable rules for linting
```json
{
  "extends": "@vue/tsconfig/tsconfig.json",
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

16. Add npm script for type checking
```json
"scripts": {
  "dev": "vite --host",
  "preview": "vite preview --host",
  "build": "vite build",
  "typecheck": "vue-tsc",
},
```

## Path aliases

17. Add ``imports`` section to `package.json`
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

17. Create `.env` file, add environment variables
```
VITE_FOO=Hello
```

18. Create `src/vite-env.d.ts` file
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

19. Install: 
  * eslint ([docs](https://eslint.org/docs/latest/use/getting-started))
  * Official config for eslint + typescript + vue ([github](https://github.com/vuejs/eslint-config-typescript))
  * eslint vue plugin ([github](https://github.com/vuejs/eslint-plugin-vue))
  * eslint import/export plugin ([github](https://github.com/import-js/eslint-plugin-import))
  * eslint import resolver ([github](https://github.com/import-js/eslint-import-resolver-typescript))
  * eslint stylistic plugin ([github](https://github.com/eslint-stylistic/eslint-stylistic))

```bash
npm add eslint@9.17.0 @vue/eslint-config-typescript@14.1.4 eslint-plugin-vue@9.32.0 eslint-plugin-import@2.31.0 eslint-import-resolver-typescript@3.7.0 @stylistic/eslint-plugin@2.12.1 -ED
```

20. Create `eslint.config.mjs` file, enable recommended rules
```js
import importPlugin from 'eslint-plugin-import'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default [
  { ignores: ['dist'] }, /* Ignore output folder */
  importPlugin.flatConfigs.recommended, /* Imports */
  ...pluginVue.configs['flat/recommended'], /* Vue */
  stylistic.configs['recommended-flat'], /* Formatting */
  {
    rules: { /* Enable rules here */
      'sort-imports': 'error',
    },
  },
  ...vueTsEslintConfig({ /* Main config */
    extends: [
      'recommendedTypeChecked',
      'stylisticTypeChecked',
    ],
  }),
  {
    rules: { /* Disable rules here */
      /* Replaced by typecheck */
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unreachable': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    settings: {  /* Import resolving */
      'import/resolver': {
        typescript: {},
      },
    },
  },
]
````

21. Add npm scripts for linting
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

22. Install sass
```bash
npm add sass@1.83.0 -ED
```

[Sass docs](https://sass-lang.com/documentation/)

23. Set `<style>` lang to "sass"
```html
<style scoped lang="sass">
$primary-color: blue

h1
  color: $primary-color
</style>
```

24. Install CSS normalizer
```bash
npm add normalize.css@8.0.1 -ED
```

25. Import it to `src/main.ts` file
```typescript
import 'normalize.css'
```

## Favicon

Vite exposes `public` folder

26. Create public folder, copy `favicon.ico` to it
```bash
mkdir public
```

Results so far:
![[3.png]]

## Fonts

27. To install sample font:
```bash
npm install @fontsource-variable/exo-2
```

([github](https://github.com/fontsource/fontsource))

28. To import it:
```typescript
import '@fontsource-variable/exo-2'
```

29. To use it:
```html
<style lang="sass">
p
  font-family: 'Exo 2 Variable'
</style>
```

## Font Awesome

30. Install free SVG icons and vue component
```bash
npm add @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/vue-fontawesome -D
```

31. Import Font Awesome Icon component and required icons
```typescript
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse'
```

32. To use:
```html
<FontAwesomeIcon :icon="faUser" />
```
