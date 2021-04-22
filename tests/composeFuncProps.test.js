import composeFuncProps from '../src/composeFuncProps';

describe('composeFuncProps', () => {
  it('composeFuncProps', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const a = { value: '11', onChange: aChange, onBlur: aBlur };
    const b = { onChange: bChange };

    const props = composeFuncProps(a, b);
    props.onChange();
    props.onBlur();
    expect(aChange).toHaveBeenCalled();
    expect(aBlur).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();

    expect(Object.keys(props)).toEqual(['value', 'onChange', 'onBlur']);
  });
});
