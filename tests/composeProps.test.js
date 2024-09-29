import composeProps from '../src/composeProps';

describe('composeProps', () => {
  it('composeProps all', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const bDemo = jest.fn();
    const sourceProps = { value: '11', onChange: aChange, onBlur: aBlur };
    const patchProps = { onChange: bChange, onDemo: bDemo, placeholder: 'x' };

    const props = composeProps(sourceProps, patchProps, true);
    props.onChange();
    props.onBlur();
    props.onDemo();
    expect(aChange).toHaveBeenCalled();
    expect(aBlur).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();
    expect(bDemo).toHaveBeenCalled();
    expect(Object.keys(props)).toEqual([
      'value',
      'onChange',
      'onBlur',
      'onDemo',
      'placeholder',
    ]);
  });
  it('composeProps just func', () => {
    const aChange = jest.fn();
    const aBlur = jest.fn();
    const bChange = jest.fn();
    const bDemo = jest.fn();
    const sourceProps = { value: '11', onChange: aChange, onBlur: aBlur };
    const patchProps = { onChange: bChange, onDemo: bDemo, placeholder: 'x' };

    const props = composeProps(sourceProps, patchProps);
    props.onChange();
    props.onBlur();
    props.onDemo();
    expect(aChange).toHaveBeenCalled();
    expect(aBlur).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();
    expect(bDemo).toHaveBeenCalled();
    expect(Object.keys(props)).toEqual([
      'value',
      'onChange',
      'onBlur',
      'onDemo',
    ]);
  });

  it('composeProps patch return', () => {
    const aChange = jest.fn().mockImplementation(() => 'a');
    const bChange = jest.fn().mockImplementation(() => 'b');

    const props = composeProps(
      { onChange: aChange },
      { onChange: bChange }, // patch return not work (Expected)
    );

    expect(Object.keys(props)).toEqual(['onChange']);

    expect(props.onChange()).toEqual('a');
    expect(aChange).toHaveBeenCalled();
    expect(bChange).toHaveBeenCalled();
  });
});
