import { render } from '@testing-library/react';
import React, { StrictMode, useEffect } from 'react';
import Portal from '../src/Portal';

describe('Portal', () => {
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

  it('should restore to original place in StrictMode', () => {
    const parentContainer = document.createElement('div');
    const curDomContainer = document.createElement('div');
    parentContainer.appendChild(curDomContainer);
    let mountCount = 0;
    let unmountCount = 0;

    const Demo: React.FC = () => {
      useEffect(() => {
        mountCount += 1;
        return () => {
          unmountCount += 1;
        };
      }, []);

      return <Portal getContainer={() => curDomContainer}>Contents</Portal>;
    };

    render(<Demo />, { wrapper: StrictMode });

    expect(mountCount).toBe(2);
    expect(unmountCount).toBe(1);
    // portal should be attached to parent node
    expect(parentContainer.textContent).toBe('Contents');
  });
});
