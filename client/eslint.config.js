import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin"

export default [
  { ignores: ["eslint.config.js", "postcss.config.js", "tailwind.config.js", "dist"] },
  pluginJs.configs.all,
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
      "id-length": "off",
      "no-console": "off",
      "no-ternary": "off",
      "sort-keys": "off",
      "sort-vars": "off",
      // Some eslint rules are not enforced in the <script> section 
      "prefer-const": "error",
      "no-var": "error",
    }
  },
];
