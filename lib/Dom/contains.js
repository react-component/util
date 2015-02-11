module.exports = function (root, node) {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};
