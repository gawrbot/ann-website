/** @type { import('stylelint').Config } */
const config = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-styled-components',
    'stylelint-config-prettier',
  ],
  rules: {
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
  },
};

module.exports = config;
