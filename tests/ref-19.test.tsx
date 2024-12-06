/* eslint-disable no-eval */
import React from 'react';
import { getNodeRef, useComposeRef } from '../src/ref';
import { render } from '@testing-library/react';

jest.mock('react', () => {
  const react19 = jest.requireActual('react-19');
  return react19;
});

jest.mock('react-dom', () => {
  const reactDom19 = jest.requireActual('react-dom-19');
  return reactDom19;
});

jest.mock('react-dom/client', () => {
  const reactDom19Client = jest.requireActual('react-dom-19/client');
  return reactDom19Client;
});

jest.mock('react-dom/test-utils', () => {
  const reactDom19Test = jest.requireActual('react-dom-19/test-utils');
  return reactDom19Test;
});

describe('ref: React 19', () => {
  const errSpy = jest.spyOn(console, 'error');

  beforeEach(() => {
    errSpy.mockReset();
  });

  it('ensure is React 19', () => {
    // Version should start with 19
    expect(React.version).toMatch(/^19/);
  });

  it('getNodeRef', () => {
    const ref = React.createRef<HTMLDivElement>();
    const node = <div ref={ref} />;

    expect(getNodeRef(node)).toBe(ref);

    expect(errSpy).not.toHaveBeenCalled();
  });

  it('useComposeRef', () => {
    const Demo = ({ children }: { children: React.ReactElement }) => {
      const ref = React.useRef<HTMLDivElement>(null);
      const childRef = getNodeRef(children); // Should get child real `ref` props
      const mergedRef = useComposeRef(ref, childRef);

      const [childClassName, setChildClassName] = React.useState<string | null>(
        null,
      );
      React.useEffect(() => {
        setChildClassName(ref.current?.className);
      }, []);

      return (
        <>
          {React.cloneElement(children, { ref: mergedRef })}
          <div className="test-output">{childClassName}</div>
        </>
      );
    };

    const outerRef = React.createRef<HTMLDivElement>();

    const { container } = render(
      <Demo>
        <div className="bamboo" ref={outerRef} />
      </Demo>,
    );

    expect(outerRef.current?.className).toBe('bamboo');
    expect(container.querySelector('.test-output')?.textContent).toBe('bamboo');
  });
});
