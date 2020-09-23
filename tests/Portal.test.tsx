import React from 'react';
import { mount } from 'enzyme';
import PortalWrapper from '../src/PortalWrapper';

describe('Portal', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('forceRender', () => {
    const divRef = React.createRef<any>();

    const wrapper = mount(
      <PortalWrapper forceRender>
        {() => <div ref={divRef}>2333</div>}
      </PortalWrapper>,
    );

    expect(divRef.current).toBeTruthy();

    wrapper.unmount();
  });
});
