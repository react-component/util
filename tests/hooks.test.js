import * as React from 'react';
import { mount } from 'enzyme';
import useMemo from '../src/hooks/useMemo';
import useMergedState from '../src/hooks/useMergedState';
import useLayoutEffect from '../src/hooks/useLayoutEffect';

describe('hooks', () => {
  it('useMemo', () => {
    const FC = ({ open, data }) => {
      const memoData = useMemo(
        () => data,
        [open, data],
        (prev, next) => next[0] && prev[1] !== next[1],
      );
      return <div memoData={memoData} />;
    };

    const wrapper = mount(<FC data="open" open />);
    expect(wrapper.find('div').props().memoData).toEqual('open');

    wrapper.setProps({ data: 'again' });
    expect(wrapper.find('div').props().memoData).toEqual('again');

    wrapper.setProps({ data: 'close', open: false });
    expect(wrapper.find('div').props().memoData).toEqual('again');

    wrapper.setProps({ data: 'repeat', open: true });
    expect(wrapper.find('div').props().memoData).toEqual('repeat');
  });

  describe('useMergedState', () => {
    const FC = ({ value, defaultValue }) => {
      const [val, setVal] = useMergedState(null, { value, defaultValue });
      return (
        <input
          value={val}
          onChange={e => {
            setVal(e.target.value);
          }}
        />
      );
    };

    it('still control of to undefined', () => {
      const wrapper = mount(<FC value="test" />);

      expect(wrapper.find('input').props().value).toEqual('test');

      wrapper.setProps({ value: undefined });
      wrapper.update();
      expect(wrapper.find('input').props().value).toEqual(undefined);
    });

    it('correct defaultValue', () => {
      const wrapper = mount(<FC defaultValue="test" />);

      expect(wrapper.find('input').props().value).toEqual('test');
    });
  });

  describe('useLayoutEffect', () => {
    const FC = ({ defaultValue }) => {
      const [val, setVal] = React.useState(defaultValue);
      const [val2, setVal2] = React.useState();
      useLayoutEffect(() => {
        setVal2(`${val}a`);
      }, [val]);
      return (
        <div>
          <input
            value={val}
            onChange={e => {
              setVal(e.target.value);
            }}
          />
          <label>{val2}</label>
        </div>
      );
    };

    it('correct effect', () => {
      const wrapper = mount(<FC defaultValue="test" />);
      expect(wrapper.find('label').props().children).toEqual('testa');
      wrapper.find('input').simulate('change', { target: { value: '1' } });
      wrapper.update();
      expect(wrapper.find('label').props().children).toEqual('1a');
      wrapper.find('input').simulate('change', { target: { value: '2' } });
      wrapper.update();
      expect(wrapper.find('label').props().children).toEqual('2a');
    });
  });
});
