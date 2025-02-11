import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

import eslintPluginImportX from 'eslint-plugin-import-x'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  { ignores: ['dist'] }, /* Ignore output folder */
  eslint.configs.recommended,
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
