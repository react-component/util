const deprecate = require('util-deprecate');
const classNames = require('classnames');

module.exports = deprecate(classNames, '`rcUtil.joinClasses()` is deprecated, use `classNames()` by `require(\'classnames\')` instead');
