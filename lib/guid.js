var seed = 0;
module.exports = function () {
  return Date.now() + '_' + (seed++);
};
