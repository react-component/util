import composeProps from '../src/composeProps';

describe('composeProps', () => {
  it('composeProps all', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const sourceProps = { value: '11', onChange: aChange, onBlur: aBlur };
    const patchProps = { onChange: bChange, placeholder: 'x' };

    const props = composeProps(sourceProps, patchProps);
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
  it('composeProps just func', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const sourceProps = { value: '11', onChange: aChange, onBlur: aBlur };
    const patchProps = { onChange: bChange, placeholder: 'x' };

    const props = composeProps(sourceProps, patchProps, false);
    props.onChange();
    props.onBlur();
    expect(aChange).toHaveBeenCalled();
    expect(aBlur).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();
    expect(Object.keys(props)).toEqual(['value', 'onChange', 'onBlur']);
  });
});
