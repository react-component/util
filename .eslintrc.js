const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'react/no-did-update-set-state': 0,
    'react/no-find-dom-node': 0,
  },
};
