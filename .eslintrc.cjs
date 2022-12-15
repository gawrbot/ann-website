/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
  extends: ['@upleveled/upleveled'],
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'warn',
    'tailwindcss/no-contradicting-classname': 'error',
  },
  // Source for config extension from eslint github issues: https://github.com/typescript-eslint/typescript-eslint/issues/6215
  // overrides: [
  //   // disable type-aware linting for some files
  //   {
  //     files: ['.eslintrc.cjs', 'stylelint.config.cjs'],
  //     extends: ['plugin:@typescript-eslint/disable-type-aware-linting'],
  //   },
  // ],
};

module.exports = config;
