import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, unmount, _r, _u } from '../src/React/render';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('React', () => {
  afterEach(() => {
    Array.from(document.body.childNodes).forEach(node => {
      document.body.removeChild(node);
    });
  });

  it('render & unmount', async () => {
    const errorSpy = jest.spyOn(console, 'error');

    const div = document.createElement('div');
    document.body.appendChild(div);

    // Mount
    act(() => {
      render(<div className="bamboo" />, div);
    });
    expect(div.querySelector('.bamboo')).toBeTruthy();

    // Unmount
    await act(async () => {
      await unmount(div);
    });
    expect(div.querySelector('.bamboo')).toBeFalsy();

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('React 17 render & unmount', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Mount
    act(() => {
      _r(<div className="bamboo" />, div);
    });
    expect(div.querySelector('.bamboo')).toBeTruthy();

    // Unmount
    act(() => {
      _u(div);
    });
    expect(div.querySelector('.bamboo')).toBeFalsy();
  });
});
