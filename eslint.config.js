const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  // Ignores (replaces .eslintignore)
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'fly-dist/**',
      'webpack/**',
      'ts-compiler-dump.*',
      'testSetup.ts',
      'cypress/plugins/**', // legacy Cypress v9 plugin file, not in tsconfig
    ],
  },

  // @typescript-eslint: parser + plugin + recommended rules (no project — applies broadly)
  ...tsPlugin.configs['flat/recommended'],

  // import plugin: recommended rules + TypeScript resolver settings
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,

  // Base config: all JS/TS files — lint rules that don't need type information
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['cypress/**'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: './tsconfig.eslint.json' },
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
      },
    },
    rules: {
      // React recommended
      ...reactPlugin.configs.flat.recommended.rules,

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility
      ...jsxA11y.flatConfigs.recommended.rules,

      // Prettier: disable conflicting formatting rules, then enforce prettier
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // ── Project rules (inlined from eslint-config-boclips) ──────────────
      'import/extensions': [
        'error',
        'never',
        { svg: 'always', png: 'always', less: 'always', json: 'always' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-shadow': 'off', // replaced by @typescript-eslint/no-shadow
      '@typescript-eslint/no-shadow': 'error',
      'no-param-reassign': ['error', { props: false }],
      '@typescript-eslint/ban-ts-comment': 'warn', // downgrade from recommended's error
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/prop-types': 'off', // TypeScript makes prop-types redundant
      // v8 promoted these from warn → error; keep as warn during migration
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // CJS root config files — allow require() since the package type is commonjs
  {
    files: ['*.js', '__mocks__/**/*.js', 'cypress/plugins/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Type-aware rules: scoped to src where parserOptions.project is valid
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-deprecated': 'warn', // replaces eslint-plugin-deprecation
    },
  },

  // Cypress files use their own tsconfig
  {
    files: ['cypress/**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './cypress/tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
  },
];
