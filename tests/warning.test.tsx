import React from 'react';
import { render } from '@testing-library/react';
import unsafeLifecyclesPolyfill from '../src/unsafeLifecyclesPolyfill';

describe('warning', () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    errorSpy.mockClear();
    warnSpy.mockClear();
  });

  describe('process.env.NODE_ENV !== "production"', () => {
    const {
      warningOnce,
      noteOnce,
      resetWarned,
      noop,
    } = require('../src/warning');

    it('Test noop', () => {
      noop();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('Test warningOnce', () => {
      warningOnce(true, 'error message');
      expect(errorSpy).not.toHaveBeenCalled();

      warningOnce(false, 'error message');
      expect(errorSpy).toHaveBeenCalledWith('Warning: error message');

      expect(errorSpy).toHaveBeenCalledTimes(1);

      // do not exec `console.error` after first time
      warningOnce(false, 'error message');
      expect(errorSpy).toHaveBeenCalledTimes(1);
      // clear cache
      resetWarned();

      warningOnce(false, 'error message');
      expect(errorSpy).toHaveBeenCalledTimes(2);
    });

    it('Test noteOnce', () => {
      noteOnce(true, 'warn message');
      expect(warnSpy).not.toHaveBeenCalled();

      noteOnce(false, 'warn message');
      expect(warnSpy).toHaveBeenCalledWith('Note: warn message');

      expect(warnSpy).toHaveBeenCalledTimes(1);
      // do not exec `console.error` after first time
      noteOnce(false, 'error message');
      expect(warnSpy).toHaveBeenCalledTimes(1);
      // clear cache
      resetWarned();

      noteOnce(false, 'error message');
      expect(warnSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('process.env.NODE_ENV === "production"', () => {
    const prevEnv = process.env.NODE_ENV;

    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      process.env.NODE_ENV = prevEnv;
    });

    it('Test warningOnce, whether `true` or `false`, do not exec `console.error`', () => {
      const { warningOnce } = require('../src/warning');

      warningOnce(true, 'error message');
      expect(errorSpy).not.toHaveBeenCalled();

      warningOnce(false, 'error message');
      expect(errorSpy).not.toHaveBeenCalled();

      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    it('Test noteOnce, whether `true` or `false`, do not exec `console.warn`', () => {
      const { noteOnce } = require('../src/warning');

      noteOnce(true, 'warn message');
      expect(warnSpy).not.toHaveBeenCalled();

      noteOnce(false, 'warn message');
      expect(warnSpy).not.toHaveBeenCalled();

      expect(warnSpy).toHaveBeenCalledTimes(0);
    });
  });

  // https://github.com/ant-design/ant-design/issues/9792
  it('should not warning React componentWillReceiveProps', () => {
    class App extends React.Component {
      state = {};

      render() {
        return null;
      }
    }
    const FixedWarningApp = unsafeLifecyclesPolyfill(App);
    render(<FixedWarningApp />);
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('componentWillReceiveProps has been renamed'),
    );
    warnSpy.mockRestore();
  });
});
