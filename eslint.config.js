// @ts-check
const eslint = require("@eslint/js");
const importPlugin = require('eslint-plugin-import');
const tseslint = require("typescript-eslint");
const { defineConfig } = require('eslint/config');
const angular = require("angular-eslint");
const ngrx = require("@ngrx/eslint-plugin/v9");
const stylistic = require('@stylistic/eslint-plugin');
module.exports = defineConfig(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      stylistic.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...ngrx.configs.all,
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      import: importPlugin
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@ngrx/no-multiple-actions-in-effects": "off",
      "@ngrx/no-store-subscription": "off",
      "@ngrx/prefer-effect-callback-in-block-statement": "off",
      "@stylistic/brace-style": [
        "error",
        "1tbs"
      ],
      "@stylistic/comma-dangle": [
        "error",
        "always-multiline",
      ],
      "@stylistic/indent": [
        "error",
        2,
        {
          ignoredNodes: ["ObjectExpression"]
        }
      ],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          "multiline": {
            "delimiter": "comma",
            "requireLast": true
          },
          "singleline": {
            "delimiter": "comma",
            "requireLast": false
          },
          "overrides": {
            "interface": {
              "multiline": {
                "delimiter": "semi",
                "requireLast": true
              }
            }
          }
        }
      ],
      "@stylistic/no-multi-spaces": [
        "error",
        {
          "exceptions": {
            "TSEnumMember": true
          }
        }
      ],
      "@stylistic/operator-linebreak": [
        "error",
        "before",
        {
          "overrides": {
            "=": "after"
          }
        }
      ],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/space-infix-ops": [
        "error",
        {
          "ignoreTypes": true,
        }
      ],
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        }
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          "prefer": "no-type-imports"
        }
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "default",
          "format": [
            "camelCase"
          ]
        },
        {
          "selector": "enumMember",
          "format": [
            "UPPER_CASE"
          ]
        },
        {
          "selector": "objectLiteralProperty",
          "format": [
            "camelCase"
          ]
        },
        {
          "selector": "typeParameter",
          "format": [
            "PascalCase",
            "UPPER_CASE"
          ]
        },
        {
          "selector": [
            "class",
            "enum",
            "interface",
            "typeAlias"
          ],
          "format": [
            "PascalCase"
          ]
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-inferrable-types": [
        "off",
        {
          "ignoreParameters": true
        }
      ],
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "(.)Effect\\$$"
        }
      ],
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/unbound-method": "off",
      "import/no-dynamic-require": "error",
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
      "no-invalid-this": "off",
      "no-new-func": "error",
      "no-param-reassign": "error",
      "no-redeclare": "error",
      "no-unused-vars": "off",
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
