module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  env: {
    node: true,
    es2022: true
  },
  rules: {
    // TypeScript specific
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/require-await': 'warn',
    
    // General
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'no-duplicate-imports': 'error',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // Code style
    'max-len': ['warn', { 
      code: 120, 
      ignoreStrings: true, 
      ignoreTemplateLiterals: true,
      ignoreComments: true 
    }],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
    'complexity': ['warn', 15]
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.test.ts', '**/*.steps.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'max-lines-per-function': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'allure-results/',
    'allure-report/',
    'test-results/',
    'playwright-report/',
    'coverage/'
  ]
};
