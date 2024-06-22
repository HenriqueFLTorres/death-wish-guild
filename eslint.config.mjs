import { default as eslint, default as eslintPlugin } from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import stylisticPlugin from "@stylistic/eslint-plugin"
import importPlugin from "eslint-plugin-import"
import prettierPlugin from "eslint-plugin-prettier"
import reactPlugin from "eslint-plugin-react"
import hooksPlugin from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

const ignores = ["node_modules/*", ".next/*"]

const plugins = {
  eslint: eslint.configs.recommended,
  react: reactPlugin,
  "react-hooks": hooksPlugin,
  import: importPlugin,
  "@next/next": nextPlugin,
  "@stylistic": stylisticPlugin,
  prettier: prettierPlugin,
}
const config = tseslint.config(
  ...tseslint.configs.recommended,
  eslintPlugin.configs.recommended,
  {
    plugins,
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...importPlugin.configs.typescript.rules,
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
        },
      ],
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    rules: {
      "import/export": "error",
      "import/no-cycle": "error",
      "import/no-unused-modules": "error",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "~/**",
              group: "internal",
            },
          ],
        },
      ],
      ...prettierPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "react/jsx-sort-props": [
        "error",
        { shorthandLast: true, callbacksLast: true, ignoreCase: true },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
            },
          ],
          patterns: [
            {
              group: ["@radix-ui/*"],
              importNames: ["default"],
            },
          ],
        },
      ],
      "no-implicit-coercion": [
        "error",
        { boolean: false, number: true, string: true },
      ],
      "@stylistic/quotes": ["error", "double"],
      "prettier/prettier": ["error"],
    },
  },
  {
    ignores,
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
      },
      sourceType: "module",
    },
  }
)

export default config
