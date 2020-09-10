module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:react-native-a11y/all'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'detox'],
  env: {
    'jest/globals': true,
    'detox/detox': true
  },
  rules: {
    'comma-dangle': 'off'
  }
};
