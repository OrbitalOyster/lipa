_Date: 11/02/2025_

Prerequisites:
- bun (v1.2.2)

## Table of contents

- [[#Initial setup]]
- [[#Typescript]]
- [[#ESLint]]
- [[#.env]]
## Initial setup

Create:
- `src` folder
- `src/index.ts` file
- `package.json` file

```bash
mkdir src
touch src/index.ts
```

```typescript
console.log('Hello, World!')
```

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

Install bun types
```bash
bun add @types/bun@1.2.2 -ED
```

To run app:
```bash
bun run src
```

## Typescript

Install typescript and recommended bun config for typescript

```bash
bun add typescript@5.7.3 @tsconfig/bun@1.0.7 -ED
```

Create `tsconfig.json` file, extend it from recommended config, enable all rules
```bash
touch tsconfig.json
```

```json
{
  "extends": [
    "@tsconfig/bun/tsconfig.json"
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

To typecheck:

```bash
bun run tsc
```
## ESLint

Install:
  * ESLint ([docs](https://eslint.org/docs/latest/use/getting-started))
  * ESLint import/export plugin ([github](https://github.com/un-ts/eslint-plugin-import-x))
  * ESLint import resolver ([github](https://github.com/import-js/eslint-import-resolver-typescript))
  * ESLint stylistic plugin ([github](https://github.com/eslint-stylistic/eslint-stylistic))

```bash
bun add eslint@9.20.0 eslint-plugin-import-x@4.6.1 eslint-import-resolver-typescript@3.7.0 @stylistic/eslint-plugin@3.1.0 -ED
```

Create `eslint.config.mjs` file
```js
import eslint from '@eslint/js'
import eslintPluginImportX from 'eslint-plugin-import-x'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended, /* Main config */
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginImportX.flatConfigs.recommended, /* Import plugin */
  stylistic.configs['recommended-flat'], /* Formatting */
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

To lint:
```bash
bun run eslint
```

# .env

Bun supports .env files out of the box