import React from 'react';
import { mount } from 'enzyme';
import toArray from '../src/Children/toArray';

describe('toArray', () => {
  it('basic', () => {
    const wrapper = mount(
      <ul>
        <li key="1">1</li>
        <li key="2">2</li>
        <li key="3">3</li>
      </ul>,
    );

    const children = toArray(wrapper.props().children);
    expect(children).toHaveLength(3);
    expect(children.map(c => c.key)).toEqual(['1', '2', '3']);
  });

  it('Array', () => {
    const wrapper = mount(
      <ul>
        <li key="1">1</li>
        {[<li key="2">2</li>, <li key="3">3</li>]}
      </ul>,
    );

    const children = toArray(wrapper.props().children);
    expect(children).toHaveLength(3);
    expect(children.map(c => c.key)).toEqual(['1', '2', '3']);
  });

  it('Fragment', () => {
    const wrapper = mount(
      <ul>
        <li key="1">1</li>
        <>
          <li key="2">2</li>
          <li key="3">3</li>
        </>
        <React.Fragment>
          <>
            <li key="4">4</li>
            <li key="5">5</li>
          </>
        </React.Fragment>
      </ul>,
    );

    const children = toArray(wrapper.props().children);
    expect(children).toHaveLength(5);
    expect(children.map(c => c.key)).toEqual(['1', '2', '3', '4', '5']);
  });
});
