import warning, { resetWarned } from '../src/warning';

describe('warning', () => {
  it('warning', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warning(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledWith('Warning: [antd Component] test hello world');

    warning(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledTimes(1);

    resetWarned();

    warning(false, '[antd Component] test hello world');
    expect(warnSpy).toHaveBeenCalledTimes(2);

    warning(true, '[antd Component] test1');
    expect(warnSpy).not.toHaveBeenCalledWith('[antd Component] test1');

    warnSpy.mockRestore();
  });
});
