import { render } from '@testing-library/react';
import * as React from 'react';
import findDOMNode, { getDomNode, isDOM } from '../src/Dom/findDOMNode';
import proxyObject from '../src/proxyObject';

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

  it('with proxyObject', () => {
    const Demo = React.forwardRef((_, ref) => {
      const rootRef = React.useRef<HTMLDivElement>(null);
      const spanRef = React.useRef<HTMLParagraphElement>(null);

      React.useImperativeHandle(ref, () =>
        proxyObject(rootRef.current, {
          nativeElement: spanRef.current,
        }),
      );

      return (
        <p ref={rootRef} id="root">
          <span ref={spanRef} />
        </p>
      );
    });

    const holderRef = React.createRef<any>();
    const { container } = render(
      <React.StrictMode>
        <Demo ref={holderRef} />
      </React.StrictMode>,
    );

    expect(holderRef.current.id).toBe('root');
    expect(findDOMNode(holderRef.current)).toBe(
      container.querySelector('span'),
    );
  });

  describe('getDomNode', () => {
    it('should return the DOM node when input is a DOM node', () => {
      const node = document.createElement('div');
      const result = getDomNode(node);

      expect(result).toBe(node);
    });

    it('should return the nativeElement when input is an object with a DOM node as nativeElement', () => {
      const nativeElement = document.createElement('div');
      const node = { nativeElement };

      const result = getDomNode(node);

      expect(result).toBe(nativeElement);
    });

    it.each([null, void 0, { foo: 'bar' }, 'string'])(
      'should return null when input is not a DOM node',
      node => {
        const result = getDomNode(node);

        expect(result).toBeNull();
      },
    );
  });
});
