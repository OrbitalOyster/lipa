import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import pluginImport from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin"

export default [
  { ignores: ["eslint.config.js", "postcss.config.js", "tailwind.config.js", "dist"] },
  pluginJs.configs.all,
  ...tseslint.configs.strictTypeChecked,
  ...pluginVue.configs["flat/recommended"],
  pluginImport.flatConfigs.recommended,
  stylistic.configs["recommended-flat"],
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".vue"],
        parser: tseslint.parser,
        projectService: true,
      }
    },
    rules: {
      "id-length": "off",
      "no-console": "off",
      "no-ternary": "off",
      "sort-keys": "off",
      "sort-vars": "off",
      "no-magic-numbers": "off",
      // Replaced by import/no-duplicates
      "no-duplicate-imports": "off",
      // Some eslint rules are not enforced in the <script> section 
      "prefer-const": "error",
      "no-var": "error",
    }
  },
];
