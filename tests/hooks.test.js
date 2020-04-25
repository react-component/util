import * as React from 'react';
import { mount } from 'enzyme';
import useMemo from '../src/hooks/useMemo';
import useMergedState from '../src/hooks/useMergedState';

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
});
