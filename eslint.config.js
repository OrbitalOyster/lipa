import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin"

export default [
  { ignores: ["eslint.config.js", "dist"] },
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".vue"],
        parser: tseslint.parser,
        projectService: true,
      }
    },
    rules: {
      // Some eslint rules are not enforced in the <script> section 
      "prefer-const": "error",
      "no-var": "error",
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...pluginVue.configs["flat/recommended"],
  stylistic.configs["recommended-flat"],
];
