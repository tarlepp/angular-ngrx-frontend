// @ts-check
const eslint = require("@eslint/js");
const importPlugin = require('eslint-plugin-import');
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      import: importPlugin
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": [
        "off",
        {
          "ignoreParameters": true
        }
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          "devDependencies": false
        }
      ],
      "import/order": [
        "error",
        {
          "pathGroups": [
            {
              "pattern": "^(?!src\\/|package.json)([@]|[a-z])",
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "^(src\\/|package.json)",
              "group": "internal",
              "position": "after"
            }
          ],
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          },
          "groups": [
            "external",
            "internal"
          ],
          "newlines-between": "ignore",
          "pathGroupsExcludedImportTypes": [
            "builtin"
          ]
        }
      ],
      "import/no-dynamic-require": "error",
      "no-unused-vars": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
