const shallowEqual = require('shallowequal');
const deprecate = require('util-deprecate');

module.exports = deprecate(shallowEqual, '`rcUtil.shallowEqual()` is deprecated, use `shallowEqual()` by `require(\'shallowequal\')` instead');
