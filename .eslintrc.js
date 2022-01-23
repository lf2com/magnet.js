module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // prevent argument of function error in .ts
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],

    // prevent enum declaration error in .ts
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // enable console
    // 'no-console': 'off',

    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
    }],

    // method overload
    'no-dupe-class-members': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
