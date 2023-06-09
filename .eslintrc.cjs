module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off'
      }
    }
  ],
  plugins: ['svelte3'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.svelte']
  },
  rules: {
    'missing-declaration': 'off',
    'no-undef': 'off',
    'camelcase': 'off',
    'no-multiple-empty-lines': 'off',
    'prefer-const': 'off'
  },
  settings: {
    'svelte3/ignore-warnings': (warn) => {
      return warn.message === "'intl' is not defined"
    }
  }
}
