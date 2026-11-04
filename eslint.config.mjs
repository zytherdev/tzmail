import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // URL validators intentionally reject C0 control characters.
      'no-control-regex': 'off'
    }
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
);
