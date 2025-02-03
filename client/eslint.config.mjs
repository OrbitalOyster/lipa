import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import importPlugin from 'eslint-plugin-import'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfigWithVueTs(
  { ignores: ['dist'] }, /* Ignore output folder */
  importPlugin.flatConfigs.recommended, /* Imports */
  ...pluginVue.configs['flat/recommended'], /* Vue */
  stylistic.configs['recommended-flat'], /* Formatting */
  {
    rules: { /* Enable rules here */
      'sort-imports': 'error',
    },
  },
  vueTsConfigs.recommendedTypeChecked,
  vueTsConfigs.stylisticTypeChecked,
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
)
