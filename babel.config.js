module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  },
  plugins: [
    [
      'dotenv-import',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: false
      }
    ]
  ]
};
