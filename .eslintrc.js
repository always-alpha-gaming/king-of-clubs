module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    THREE: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'strict': ['error', 'global'],
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'class-methods-use-this': 'off',
  },
};
