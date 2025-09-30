import { act } from '@testing-library/react';
import { render, unmount } from '../src/React/render';

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
});
