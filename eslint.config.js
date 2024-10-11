import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin"

export default [
  { ignores: ["eslint.config.js", "dist"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...pluginVue.configs["flat/recommended"],
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
      "no-console": "off",
      "no-ternary": "off",
      // Some eslint rules are not enforced in the <script> section 
      "prefer-const": "error",
      "no-var": "error",
    }
  },
];
