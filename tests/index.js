const expect = require('expect.js');
const createChainedFunction = require('../src/createChainedFunction');

describe('createChainedFunction', () => {
  it('should work', () => {
    const ret = [];

    function f1() {
      ret.push(1);
    }

    function f2() {
      ret.push(2);
    }

    function f3() {
      ret.push(3);
    }

    createChainedFunction(f1, f2, f3, null)();
    expect(ret).to.eql([1, 2, 3]);
  });
});
