import { render } from '@testing-library/react';
import React from 'react';
import { warning } from '../src';
import unsafeLifecyclesPolyfill from '../src/unsafeLifecyclesPolyfill';

const { resetWarned, noteOnce } = warning;

describe('warning', () => {
  beforeEach(() => {
    resetWarned();
  });

  it('warning', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warning(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledWith(
      'Warning: [antd Component] test hello world',
    );

    warning(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledTimes(1);

    resetWarned();

    warning(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledTimes(2);

    warning(true, '[antd Component] test1');
    expect(warnSpy).not.toHaveBeenCalledWith('[antd Component] test1');

    warnSpy.mockRestore();
  });

  it('note', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    noteOnce(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledWith(
      'Note: [antd Component] test hello world',
    );

    noteOnce(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledTimes(1);

    resetWarned();

    noteOnce(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledTimes(2);

    noteOnce(true, '[antd Component] test1');
    expect(warnSpy).not.toHaveBeenCalledWith('[antd Component] test1');

    warnSpy.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/9792
  it('should not warning React componentWillReceiveProps', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
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

  describe('preMessage', () => {
    it('modify message', () => {
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      warning.preMessage((msg, type) => {
        if (type === 'warning') {
          return `WW-${msg}`;
        }
        if (type === 'note') {
          return `NN-${msg}`;
        }

        return null;
      });

      warning(false, 'warn');
      warning.noteOnce(false, 'note');

      expect(errSpy).toHaveBeenCalledWith('Warning: WW-warn');
      expect(warnSpy).toHaveBeenCalledWith('Note: NN-note');

      errSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });
});
