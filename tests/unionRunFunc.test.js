import unionRunFunc from '../src/unionRunFunc';

describe('unionRunFunc', () => {
  it('unionRunFunc', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const a = { value: '11', onChange: aChange, onBlur: aBlur };
    const b = { onChange: bChange };

    const unionRunFuncProps = unionRunFunc(a, b);
    unionRunFuncProps.onChange();
    unionRunFuncProps.onBlur();
    expect(aChange).toHaveBeenCalled();
    expect(aBlur).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();

    expect(Object.keys(unionRunFuncProps)).toEqual([
      'value',
      'onChange',
      'onBlur',
    ]);
  });
});
