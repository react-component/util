/* eslint-disable class-methods-use-this */
import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import { spyElementPrototype } from '../src/test/domHook';
import { getFocusNodeList, triggerFocus, useLockFocus } from '../src/Dom/focus';

describe('focus', () => {
  beforeAll(() => {
    spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => document.body,
    });
  });

  it('getFocusNodeList', () => {
    const div = document.createElement('div');
    div.setAttribute('tabIndex', '0');
    document.body.appendChild(div);

    div.innerHTML = [
      '<input disabled />',
      '<button></button>',
      '<textarea tabindex="-1"></textarea>',
      '<a>noop</a>',
      '<a href="light">go</a>',
      '<div contenteditable="true"></div>',
    ].join('');

    (div.lastChild as any).isContentEditable = true;

    const focusList = getFocusNodeList(div);
    expect(focusList).toHaveLength(4);

    const tabFocusList = getFocusNodeList(div, true);
    expect(tabFocusList).toHaveLength(5);
  });

  it('triggerFocus should set cursor position for textarea', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'test content';

    const focusSpy = jest.spyOn(textarea, 'focus');
    const setSelectionRangeSpy = jest.spyOn(textarea, 'setSelectionRange');

    // Test cursor: 'start'
    triggerFocus(textarea, { cursor: 'start' });
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(0, 0);

    // Test cursor: 'end'
    triggerFocus(textarea, { cursor: 'end' });
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(12, 12); // 'test content'.length = 12

    // Test cursor: 'all'
    triggerFocus(textarea, { cursor: 'all' });
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(0, 12); // select all text

    expect(focusSpy).toHaveBeenCalledTimes(3);

    focusSpy.mockRestore();
    setSelectionRangeSpy.mockRestore();
  });

  describe('useLockFocus', () => {
    const TestComponent: React.FC<{ lock: boolean }> = ({ lock }) => {
      const elementRef = useRef<HTMLDivElement>(null);
      useLockFocus(lock, () => elementRef.current);

      return (
        <>
          <button data-testid="outer-button">Outer</button>
          <div ref={elementRef} data-testid="focus-container" tabIndex={0}>
            <input key="input1" data-testid="input1" />
            <button key="button1" data-testid="button1">
              Button
            </button>
          </div>
        </>
      );
    };

    it('should restore focus to range when focusing other elements', () => {
      const { getByTestId } = render(<TestComponent lock={true} />);

      const focusContainer = getByTestId('focus-container');
      const input1 = getByTestId('input1') as HTMLInputElement;

      // Should focus to first focusable element after lock
      expect(document.activeElement).toBe(focusContainer);

      // Focus inside container first
      input1.focus();
      expect(document.activeElement).toBe(input1);

      // Focus outer button
      const outerButton = getByTestId('outer-button') as HTMLButtonElement;
      outerButton.focus();
      expect(document.activeElement).toBe(input1);
    });
  });

  it('ignoreElement should allow focus on ignored elements', () => {
    let capturedIgnoreElement: ((ele: HTMLElement) => void) | null = null;

    const TestComponent: React.FC = () => {
      const elementRef = useRef<HTMLDivElement>(null);
      const [ignoreElement] = useLockFocus(true, () => elementRef.current);

      if (ignoreElement && !capturedIgnoreElement) {
        capturedIgnoreElement = ignoreElement;
      }

      return (
        <>
          <button data-testid="ignored-button">Ignored</button>
          <div ref={elementRef} data-testid="focus-container" tabIndex={0}>
            <input key="input1" data-testid="input1" />
          </div>
        </>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    const ignoredButton = getByTestId('ignored-button');

    // Mark the button as ignored
    if (capturedIgnoreElement) {
      capturedIgnoreElement(ignoredButton);
    }

    // Focus should be allowed on the ignored button
    ignoredButton.focus();
    expect(document.activeElement).toBe(ignoredButton);
  });
});
