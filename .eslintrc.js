const base = require('@umijs/fabric/dist/eslint');

const config = {
  ...base,
  rules: {
    ...base.rules,
    'react/no-did-update-set-state': 0,
    'react/no-find-dom-node': 0,
    'import/no-extraneous-dependencies': 0,
  },
};

config.parserOptions = {
  project: './node_modules/father-build/template/tsconfig.json',
};

module.exports = config;