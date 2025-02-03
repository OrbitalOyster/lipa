import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default [
  importPlugin.flatConfigs.recommended, /* Imports */
  stylistic.configs['recommended-flat'], /* Formatting */
  {
    rules: { /* Enable rules here */
      'sort-imports': 'error',
    },
  },
  ...tseslint.configs.recommendedTypeChecked, /* Main config */
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: { /* Disable rules here */
      /* Replaced by typecheck */
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unreachable': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
]
