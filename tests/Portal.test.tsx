import React from 'react';
import { mount } from 'enzyme';
import PortalWrapper from '../src/PortalWrapper';
import Portal from '../src/Portal';

describe('Portal', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it.only('forceRender', () => {
    const divRef = React.createRef<any>();

    const wrapper = mount(
      <PortalWrapper forceRender>
        {() => <div ref={divRef}>2333</div>}
      </PortalWrapper>,
    );

    expect(divRef.current).toBeTruthy();

    wrapper.unmount();
  });

  it('didUpdate', () => {
    const didUpdate = jest.fn();

    const wrapper = mount(
      <Portal
        didUpdate={didUpdate}
        getContainer={() => document.createElement('div')}
      >
        light
      </Portal>,
    );

    expect(didUpdate).toHaveBeenCalledTimes(1);

    wrapper.setProps({ justForceUpdate: true });
    expect(didUpdate).toHaveBeenCalledTimes(2);
  });
});
