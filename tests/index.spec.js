'use strict';

var expect = require('expect.js');
var rcUtil = require('..');

describe('rc-tuil', function() {
  it('#classSet', function() {
    var classSet = rcUtil.classSet;

    expect(classSet({})).to.be('');
    expect(classSet({foo: true, bar: true})).to.be('foo bar');
  });

  it('#joinClasses', function() {
    var joinClasses = rcUtil.joinClasses;

    expect(joinClasses()).to.be('');
    expect(joinClasses('foo')).to.be('foo');
    expect(joinClasses('foo', 'bar')).to.be('foo bar');
  });

  it('#shallowEqual', function() {
    var shallowEqual = rcUtil.shallowEqual;

    var a = {one: 1, two: 2};
    var b = a;
    var c = {one: 1, two: 2};
    var d = {one: 1};

    expect(shallowEqual(a, b)).to.be.ok();

    expect(shallowEqual(a, c)).to.be.ok();
    expect(shallowEqual(c, a)).to.be.ok();

    expect(shallowEqual(a, d)).not.to.be.ok();
    expect(shallowEqual(d, a)).not.to.be.ok();
  });
});
