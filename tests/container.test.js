import React from 'react';
import { mount } from 'enzyme';
import PortalWrapper from '../src/PortalWrapper';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

describe('container', () => {
  it('Same function returns different DOM', async () => {
    let root = document.getElementById('root');
    if (!root) {
      root = document.createElement('div', { id: 'root' });
      root.id = 'root';
      document.body.appendChild(root);
    }
    mount(
      <div>
        <div id="dom1">Hello</div>
        <div id="dom2">World</div>
      </div>,
      { attachTo: root },
    );
    const holdContainer = {
      container: document.getElementById('dom1'),
    };
    const getContainer = () => holdContainer.container;
    const wrapper = mount(
      <PortalWrapper getContainer={getContainer}>
        {() => 'Content'}
      </PortalWrapper>,
    );
    expect(wrapper).toMatchSnapshot();
    await delay(1000);
    holdContainer.container = document.getElementById('dom2');
    wrapper.setProps({ 'data-only-trigger-re-render': true });
    expect(wrapper).toMatchSnapshot();
  });
});
