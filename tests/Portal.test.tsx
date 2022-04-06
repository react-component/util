import React, { StrictMode, useEffect } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import PortalWrapper, { getOpenCount } from '../src/PortalWrapper';
import Portal from '../src/Portal';

describe('Portal', () => {
  let domContainer: HTMLDivElement;

  // Mock for raf
  window.requestAnimationFrame = callback => window.setTimeout(callback);
  window.cancelAnimationFrame = id => window.clearTimeout(id);

  beforeEach(() => {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    document.body.removeChild(domContainer);
  });

  it('forceRender', () => {
    const divRef = React.createRef<any>();

    const { unmount } = render(
      <PortalWrapper forceRender>
        {() => <div ref={divRef}>2333</div>}
      </PortalWrapper>,
    );

    expect(divRef.current).toBeTruthy();

    unmount();
  });

  it('didUpdate', () => {
    const didUpdate = jest.fn();

    const { rerender } = render(
      <Portal
        didUpdate={didUpdate}
        getContainer={() => document.createElement('div')}
      >
        light
      </Portal>,
    );

    expect(didUpdate).toHaveBeenCalledTimes(1);

    rerender(
      <Portal
        didUpdate={didUpdate}
        getContainer={() => document.createElement('div')}
        {...{ justForceUpdate: true }}
      >
        light
      </Portal>,
    );
    expect(didUpdate).toHaveBeenCalledTimes(2);
  });

  describe('getContainer', () => {
    it('string', () => {
      const div = document.createElement('div');
      div.id = 'bamboo-light';
      document.body.appendChild(div);

      render(
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

      render(
        <PortalWrapper visible getContainer={() => div}>
          {() => <div>2333</div>}
        </PortalWrapper>,
      );

      expect(div.childElementCount).toEqual(1);
    });

    it('htmlElement', () => {
      const div = document.createElement('div');

      render(
        <PortalWrapper visible getContainer={div}>
          {() => <div>2333</div>}
        </PortalWrapper>,
      );

      expect(div.childElementCount).toEqual(1);
    });

    it('delay', () => {
      jest.useFakeTimers();
      const divRef = React.createRef<HTMLDivElement>();
      render(
        <div>
          <PortalWrapper visible getContainer={() => divRef.current}>
            {() => <div />}
          </PortalWrapper>
          <div ref={divRef} />
        </div>,
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(divRef.current.childElementCount).toEqual(1);
      jest.useRealTimers();
    });
  });

  describe('openCount', () => {
    it('start as 0', () => {
      expect(getOpenCount()).toEqual(0);

      const { rerender, unmount } = render(
        <PortalWrapper visible={false}>{() => <div>2333</div>}</PortalWrapper>,
      );
      expect(getOpenCount()).toEqual(0);

      rerender(<PortalWrapper visible>{() => <div>2333</div>}</PortalWrapper>);
      expect(getOpenCount()).toEqual(1);

      unmount();
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

      const { rerender } = render(<Demo count={1} visible />);
      expect(getOpenCount()).toEqual(1);

      rerender(<Demo count={2} visible />);
      expect(getOpenCount()).toEqual(2);

      rerender(<Demo count={1} visible />);
      expect(getOpenCount()).toEqual(1);

      rerender(<Demo count={1} visible={false} />);
      expect(getOpenCount()).toEqual(0);
    });
  });

  it('wrapperClassName', () => {
    const { rerender } = render(
      <PortalWrapper visible wrapperClassName="bamboo">
        {() => <div />}
      </PortalWrapper>,
    );
    expect(document.body.querySelector('.bamboo')).toBeTruthy();

    rerender(
      <PortalWrapper visible wrapperClassName="light">
        {() => <div />}
      </PortalWrapper>,
    );
    expect(document.body.querySelector('.light')).toBeTruthy();
  });

  it('should restore to original place in StrictMode', () => {
    const parentContainer = document.createElement('div');
    const domContainer = document.createElement('div');
    parentContainer.appendChild(domContainer);
    let mountCount = 0;
    let unmountCount = 0;

    const Demo = () => {
      useEffect(() => {
        mountCount += 1;
        return () => {
          unmountCount += 1;
        };
      }, []);

      return <Portal getContainer={() => domContainer}>Contents</Portal>;
    };

    render(<Demo />, { wrapper: StrictMode });

    expect(mountCount).toBe(2);
    expect(unmountCount).toBe(1);
    // portal should be attached to parent node
    expect(parentContainer.textContent).toBe('Contents');
  });
});
