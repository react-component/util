/* eslint-disable no-eval */
import React from 'react';
import { getNodeRef } from '../src/ref';

jest.mock('react', () => {
  const react19 = jest.requireActual('react-19');
  return react19;
});

jest.mock('react-dom', () => {
  const reactDom19 = jest.requireActual('react-dom-19');
  return reactDom19;
});

describe('ref: React 19', () => {
  const errSpy = jest.spyOn(console, 'error');

  beforeEach(() => {
    errSpy.mockReset();
  });

  it('getNodeRef', () => {
    const ref = React.createRef<HTMLDivElement>();
    const node = <div ref={ref} />;

    expect(getNodeRef(node)).toBe(ref);

    expect(errSpy).not.toHaveBeenCalled();
  });
});
