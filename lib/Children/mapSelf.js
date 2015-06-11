var React = require('react');

function mirror(o) {
  return o;
}

module.exports = function (children) {
  // return ReactFragment
  return React.Children.map(children, mirror);
};
