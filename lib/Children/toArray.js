var React = require('react');

module.exports = function (children) {
  var ret = [];
  React.Children.forEach(children, function (c) {
    ret.push(c);
  });
  return ret;
};
