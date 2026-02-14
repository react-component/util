import { render } from '@testing-library/react';
import * as React from 'react';
import findDOMNode, { getDOM, isDOM } from '../src/Dom/findDOMNode';
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
      private elementRef = React.createRef<HTMLDivElement>();
      getDOM = () => {
        return findDOMNode(this.elementRef);
      };

      render() {
        return <div ref={this.elementRef} />;
      }
    }

    const wrapperRef = React.createRef<DOMWrapper>();
    const { container } = render(
      <React.StrictMode>
        <DOMWrapper ref={wrapperRef} />
      </React.StrictMode>,
    );

    expect(wrapperRef.current!.getDOM()).toBe(container.firstChild);

    expect(errSpy).not.toHaveBeenCalled();
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

  it('isDOM type in iframe', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const svg: any = iframe.contentWindow.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    // debugger;
    // This `getBoundingClientRect` is used for ts type check
    if (isDOM(svg) && svg.getBoundingClientRect()) {
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeFalsy();
    }
  });

  it('should return DOM node from ref.current', () => {
    const TestComponent = React.forwardRef<HTMLDivElement>((_, ref) => {
      return <div ref={ref}>test</div>;
    });

    const elementRef = React.createRef<HTMLDivElement>();
    const { container } = render(
      <React.StrictMode>
        <TestComponent ref={elementRef} />
      </React.StrictMode>,
    );

    expect(findDOMNode(elementRef)).toBe(container.firstChild);
  });

  it('should return null if ref is not mounted', () => {
    const elementRef = React.createRef<HTMLDivElement>();

    expect(findDOMNode(elementRef)).toBeNull();
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

  describe('getDOM', () => {
    it('should return the DOM node when input is a DOM node', () => {
      const node = document.createElement('div');
      const result = getDOM(node);

      expect(result).toBe(node);
    });

    it('should return the nativeElement when input is an object with a DOM node as nativeElement', () => {
      const nativeElement = document.createElement('div');
      const node = { nativeElement };

      const result = getDOM(node);

      expect(result).toBe(nativeElement);
    });

    it.each([null, void 0, { foo: 'bar' }, 'string'])(
      'should return null when input is not a DOM node',
      node => {
        const result = getDOM(node);

        expect(result).toBeNull();
      },
    );
  });
});
