/* eslint-disable import/no-named-as-default */
import React from 'react';
import { mount } from 'enzyme';
import warning, { resetWarned, noteOnce } from '../src/warning';
import unsafeLifecyclesPolyfill from '../src/unsafeLifecyclesPolyfill';

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
    mount(<FixedWarningApp />);
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('componentWillReceiveProps has been renamed'),
    );
    warnSpy.mockRestore();
  });
});
