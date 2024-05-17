import { render } from '@testing-library/react';
import * as React from 'react';
import findDOMNode, { isDOM } from '../src/Dom/findDOMNode';

describe('findDOMNode', () => {
  it('base work', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const divRef = React.createRef<HTMLDivElement>();
    const { container } = render(
      <React.StrictMode>
        <div ref={divRef} />
      </React.StrictMode>,
    );

    const ele = findDOMNode(divRef.current);
    expect(container.firstChild).toBe(ele);

    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('not throw if is not a React obj', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const empty = findDOMNode({} as any);
    expect(empty).toBeNull();

    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('class component', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    class DOMWrapper extends React.Component {
      getDOM = () => {
        return findDOMNode(this);
      };

      render() {
        return <div />;
      }
    }

    const wrapperRef = React.createRef<DOMWrapper>();
    const { container } = render(
      <React.StrictMode>
        <DOMWrapper ref={wrapperRef} />
      </React.StrictMode>,
    );

    expect(wrapperRef.current!.getDOM()).toBe(container.firstChild);

    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('support svg', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    expect(findDOMNode(svg)).toBe(svg);
  });

  it('isDOM type', () => {
    const svg: any = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    // This `getBoundingClientRect` is used for ts type check
    if (isDOM(svg) && svg.getBoundingClientRect()) {
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeFalsy();
    }
  });

  it('nativeElement', () => {
    const Element = React.forwardRef<{ nativeElement: HTMLDivElement }>(
      (_, ref) => {
        const domRef = React.useRef<HTMLDivElement>(null);

        React.useImperativeHandle(ref, () => ({
          nativeElement: domRef.current!,
        }));

        return <p ref={domRef} />;
      },
    );

    const elementRef = React.createRef<{ nativeElement: HTMLDivElement }>();
    const { container } = render(
      <React.StrictMode>
        <Element ref={elementRef} />
      </React.StrictMode>,
    );

    expect(findDOMNode(elementRef.current)).toBe(container.querySelector('p'));
  });
});
