import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import eslintPluginImportX from 'eslint-plugin-import-x'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfigWithVueTs(
  { ignores: ['dist'] }, /* Ignore output folder */
  eslintPluginImportX.flatConfigs.recommended, /* Import plugin */
  pluginVue.configs['flat/recommended'], /* Vue plugin */
  stylistic.configs['recommended'], /* Formatting */
  vueTsConfigs.recommendedTypeChecked, /* Main config */
  vueTsConfigs.stylisticTypeChecked,
  {
    rules: {
      'sort-imports': 'error',
      /* Replaced by typecheck */
      'no-unreachable': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {},
      },
    },
  },
)
