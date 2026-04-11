module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'google',
    'plugin:svelte/recommended',
    'prettier', // Disable ESLint rules that conflict with Prettier
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      // Pages éditoriales : prose FR longue (mentions légales, argumentaire
      // marketing) qui ne doit pas être coupée artificiellement par max-len.
      files: ['src/routes/(legal)/**/*.svelte', 'src/routes/club/**/*.svelte'],
      rules: {
        'max-len': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', {code: 120}],
    'require-jsdoc': 'off', // Disable JSDoc requirement
    'no-irregular-whitespace': ['error', {skipStrings: true, skipComments: true, skipTemplates: true}],
  },
};
