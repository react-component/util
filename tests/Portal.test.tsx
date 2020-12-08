import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import PortalWrapper, { getOpenCount } from '../src/PortalWrapper';
import Portal from '../src/Portal';

describe('Portal', () => {
  let container: HTMLDivElement;

  // Mock for raf
  window.requestAnimationFrame = callback => window.setTimeout(callback);
  window.cancelAnimationFrame = id => window.clearTimeout(id);

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

  describe('getContainer', () => {
    it('string', () => {
      const div = document.createElement('div');
      div.id = 'bamboo-light';
      document.body.appendChild(div);

      mount(
        <PortalWrapper visible getContainer="#bamboo-light">
          {() => <div>2333</div>}
        </PortalWrapper>,
      );

      expect(document.querySelector('#bamboo-light').childElementCount).toEqual(
        1,
      );

      document.body.removeChild(div);
    });

    it('function', () => {
      const div = document.createElement('div');

      mount(
        <PortalWrapper visible getContainer={() => div}>
          {() => <div>2333</div>}
        </PortalWrapper>,
      );

      expect(div.childElementCount).toEqual(1);
    });

    it('htmlElement', () => {
      const div = document.createElement('div');

      mount(
        <PortalWrapper visible getContainer={div}>
          {() => <div>2333</div>}
        </PortalWrapper>,
      );

      expect(div.childElementCount).toEqual(1);
    });

    it('delay', () => {
      jest.useFakeTimers();
      const divRef = React.createRef<HTMLDivElement>();
      const wrapper = mount(
        <div>
          <PortalWrapper visible getContainer={() => divRef.current}>
            {() => <div />}
          </PortalWrapper>
          <div ref={divRef} />
        </div>,
      );

      act(() => {
        jest.runAllTimers();
        wrapper.update();
      });

      expect(divRef.current.childElementCount).toEqual(1);
      jest.useRealTimers();
    });
  });

  describe('openCount', () => {
    it('start as 0', () => {
      expect(getOpenCount()).toEqual(0);

      const wrapper = mount(
        <PortalWrapper visible={false}>{() => <div>2333</div>}</PortalWrapper>,
      );
      expect(getOpenCount()).toEqual(0);

      wrapper.setProps({ visible: true });
      expect(getOpenCount()).toEqual(1);

      wrapper.unmount();
    });

    it('correct count', () => {
      const Demo = ({
        count,
        visible,
      }: {
        count: number;
        visible: boolean;
      }) => {
        return (
          <>
            {new Array(count).fill(null).map((_, index) => (
              <PortalWrapper key={index} visible={visible}>
                {() => <div>2333</div>}
              </PortalWrapper>
            ))}
          </>
        );
      };

      expect(getOpenCount()).toEqual(0);

      const wrapper = mount(<Demo count={1} visible />);
      expect(getOpenCount()).toEqual(1);

      wrapper.setProps({ count: 2 });
      expect(getOpenCount()).toEqual(2);

      wrapper.setProps({ count: 1 });
      expect(getOpenCount()).toEqual(1);

      wrapper.setProps({ visible: false });
      expect(getOpenCount()).toEqual(0);
    });
  });

  it('wrapperClassName', () => {
    const wrapper = mount(
      <PortalWrapper visible wrapperClassName="bamboo">
        {() => <div />}
      </PortalWrapper>,
    );
    expect((wrapper.instance() as any).container.className).toEqual('bamboo');

    wrapper.setProps({ wrapperClassName: 'light' });
    expect((wrapper.instance() as any).container.className).toEqual('light');
  });
});
