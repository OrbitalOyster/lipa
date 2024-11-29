import pluginImport from 'eslint-plugin-import'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default [
  { ignores: ['dist'] },
  pluginJs.configs.all,
  ...tseslint.configs.strictTypeChecked,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig({
    extends: ['recommendedTypeChecked', 'stylisticTypeChecked'],
  }),
  pluginImport.flatConfigs.recommended,
  stylistic.configs['recommended-flat'],
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'postcss.config.js', 'tailwind.config.js'],
          defaultProject: 'tsconfig.json',
        },
      },
    },
    rules: {
      'id-length': 'off',
      'no-console': 'off',
      'no-ternary': 'off',
      'sort-keys': 'off',
      'sort-vars': 'off',
      'no-magic-numbers': 'off',
      // Replaced by import/no-duplicates
      'no-duplicate-imports': 'off',
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@components', './src/components/'],
            ['@stores', './src/stores/'],
            ['@views', './src/views/'],
          ],
        },
      },
    },
  },
]
