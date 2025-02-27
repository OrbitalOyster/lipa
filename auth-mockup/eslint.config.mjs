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
      '@typescript-eslint/no-unused-vars': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {},
      },
    },
  },
)
