module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'strict': ['error', 'global'],
    'arrow-parens': ['error', 'always'],
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'class-methods-use-this': 'off',
  },
};
