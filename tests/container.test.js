import React from 'react';
import { mount } from 'enzyme';
import PortalWrapper from '../src/PortalWrapper';

describe('container', () => {
  let div1;
  let div2;
  beforeAll(() => {
    div1 = document.createElement('div');
    div1.id = 'dom1';
    div2 = document.createElement('div');
    div2.id = 'dom2';
    document.body.appendChild(div1);
    document.body.appendChild(div2);
  });
  afterAll(() => {
    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });
  it('Same function returns different DOM', async () => {
    const wrapper = mount(
      <PortalWrapper
        visible
        getContainer={() => document.getElementById('dom1')}
      >
        {() => <div id="children">Content</div>}
      </PortalWrapper>,
    );

    expect(document.querySelector('#dom1 #children')).not.toBeNull();

    wrapper.setProps({ getContainer: () => document.getElementById('dom2') });

    expect(document.querySelector('#dom1 #children')).toBeNull();
    expect(document.querySelector('#dom2 #children')).not.toBeNull();
  });
});
