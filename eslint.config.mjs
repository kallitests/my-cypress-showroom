// eslint.config.mjs
// Flat ESLint config (ESLint 9+) for the Cypress TypeScript test suite.

import tseslint from 'typescript-eslint';
import cypressPlugin from 'eslint-plugin-cypress';

export default tseslint.config(
  {
    ignores: ['cypress/e2e/generated/**', 'node_modules/**'], // Never lint AI-generated or vendored code
  },
  ...tseslint.configs.recommended, // Baseline recommended TypeScript rules
  {
    files: ['cypress/**/*.ts'],
    plugins: { cypress: cypressPlugin },
    languageOptions: {
      globals: {
        cy: 'readonly', // Cypress global
        Cypress: 'readonly', // Cypress global
        describe: 'readonly', // Mocha global
        it: 'readonly', // Mocha global
        before: 'readonly', // Mocha global
        beforeEach: 'readonly', // Mocha global
      },
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'warn', // Flags cy.wait(number) as a smell, kept as a warning (see regression spec)
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage `any`, but do not hard-fail the build on it
      'no-unused-vars': 'off', // Disabled in favor of the TypeScript-aware version below
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Catch genuinely unused variables
    },
  },
);
