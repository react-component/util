const expect = require('expect.js');
const rcUtil = require('..');

describe('rc-util', () => {
  it('classSet works', () => {
    const classSet = rcUtil.classSet;

    expect(classSet({})).to.be('');
    expect(classSet({foo: true, bar: true})).to.be('foo bar');
  });

  it('joinClasses works', () => {
    const joinClasses = rcUtil.joinClasses;

    expect(joinClasses()).to.be('');
    expect(joinClasses('foo')).to.be('foo');
    expect(joinClasses('foo', 'bar')).to.be('foo bar');
  });

  it('shallowEqual works', () => {
    const shallowEqual = rcUtil.shallowEqual;

    const a = {one: 1, two: 2};
    const b = a;
    const c = {one: 1, two: 2};
    const d = {one: 1};

    expect(shallowEqual(a, b)).to.be.ok();

    expect(shallowEqual(a, c)).to.be.ok();
    expect(shallowEqual(c, a)).to.be.ok();

    expect(shallowEqual(a, d)).not.to.be.ok();
    expect(shallowEqual(d, a)).not.to.be.ok();
  });

  it('createChainedFunction works', () => {
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

    rcUtil.createChainedFunction(f1, f2, f3, null)();
    expect(ret).to.eql([1, 2, 3]);
  });
});
