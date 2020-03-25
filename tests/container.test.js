import React from 'react';
import { mount } from 'enzyme';
import PortalWrapper from '../src/PortalWrapper';

describe('container', () => {
  it('Same function returns different DOM', async () => {
    mount(
      <div>
        <div id="dom1">Hello</div>
        <div id="dom2">World</div>
      </div>,
    );
    const portal = mount(
      <PortalWrapper visible={false} getContainer={false}>
        {() => <div id="children">Content</div>}
      </PortalWrapper>,
    );
    const oldWrapper = portal.parent();
    portal.setProps({
      visible: true,
      getContainer: document.getElementById('dom1'),
    });
    const wrapperDom1 = portal.parent();
    expect(oldWrapper !== wrapperDom1).toEqual(true);
    portal.setProps({
      visible: true,
      getContainer: document.getElementById('dom2'),
    });
    const wrapperDom2 = portal.parent();
    expect(wrapperDom1 !== wrapperDom2).toEqual(true);
  });
});
