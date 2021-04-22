import composeFuncProps from '../src/composeFuncProps';

describe('composeFuncProps', () => {
  it('composeFuncProps', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const sourceProps = { value: '11', onChange: aChange, onBlur: aBlur };
    const patchProps = { onChange: bChange, placeholder: 'x' };

    const props = composeFuncProps(sourceProps, patchProps);
    props.onChange();
    props.onBlur();
    expect(aChange).toHaveBeenCalled();
    expect(aBlur).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();
    expect(Object.keys(props)).toEqual([
      'value',
      'onChange',
      'onBlur',
      'placeholder',
    ]);
  });
});
