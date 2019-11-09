/* eslint-disable class-methods-use-this */
import { spyElementPrototype } from '../src/test/domHook';

describe('domHook', () => {
  function spyTest(name, propName, hookProp, assetFunc) {
    it(name, () => {
      class Test {
        func() {}
      }

      // Spy
      const originFunc = Test.prototype.func;
      const mock = spyElementPrototype(Test, propName, hookProp);

      const test = new Test();
      assetFunc(test);

      // Restore
      mock.mockRestore();
      expect(test.func).toBe(originFunc);
    });
  }

  spyTest('not exist', 'noExist', { get: () => 'bamboo' }, test => {
    expect(test.noExist).toBe('bamboo');
  });

  spyTest(
    'function',
    'func',
    () => 'light',
    test => {
      expect(test.func()).toBe('light');
    },
  );

  spyTest('prop', 'func', { get: () => 'little' }, test => {
    expect(test.func).toBe('little');
  });
});
