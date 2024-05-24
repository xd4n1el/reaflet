import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import typescriptParser from '@typescript-eslint/parser';
import pluginConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      parserOptions: {
        parser: typescriptParser,
        sourceType: 'module',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  pluginConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
