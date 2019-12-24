import * as React from 'react';
import { mount } from 'enzyme';
import useMemo from '../src/hooks/useMemo';

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
});
