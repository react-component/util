import KeyCode from '../src/KeyCode';
import { createEvent } from '@testing-library/react';

describe('KeyCode.isEditableTarget', () => {
  it('check editable target', () => {
    const eleList = [
      {
        element: 'window',
        expected: false,
      },
      {
        element: 'div',
        expected: false,
      },
      {
        element: 'input',
        expected: true,
      },
      {
        element: 'textarea',
        expected: true,
      },
      {
        element: 'select',
        expected: true,
      },
      {
        element: 'div',
        isContentEditable: true,
        expected: true,
      },
    ];

    eleList.forEach(({ element, isContentEditable, expected }) => {
      const target =
        element === 'window' ? window : document.createElement(element);
      if (isContentEditable) {
        // mock isContentEditable cause JSDOM don't support it
        Object.defineProperty(target, 'isContentEditable', { value: true });
      }
      const event = createEvent.keyDown(target) as KeyboardEvent;
      target.dispatchEvent(event);
      const result = KeyCode.isEditableTarget(event);

      expect(result).toBe(expected);
    });
  });
});
