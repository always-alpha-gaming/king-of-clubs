
'use strict';

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  overrides: [
    {
      files: ['*.js'],
      parserOptions: { sourceType: 'script' },
    },
    {
      files: ['*.mjs'],
      parserOptions: { sourceType: 'module' },
    },
  ],
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
