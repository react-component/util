const React = require('react');

module.exports = function toArray(children) {
  const ret = [];
  React.Children.forEach(children, function each(c) {
    ret.push(c);
  });
  return ret;
};
