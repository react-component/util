import * as React from 'react';
import { render } from '@testing-library/react';
import findDOMNode from '../src/Dom/findDOMNode';

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
  });

  it('not throw if is not a React obj', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const empty = findDOMNode({} as any);
    expect(empty).toBeNull();

    expect(errSpy).not.toHaveBeenCalled();
  });
});
