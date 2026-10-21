/* eslint-disable class-methods-use-this */
import React, { useEffect, useRef, useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { spyElementPrototype } from '../src/test/domHook';
import {
  getFocusNodeList,
  lockFocus,
  triggerFocus,
  useLockFocus,
} from '../src/Dom/focus';

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

  describe('lockFocus Tab boundaries', () => {
    const renderLock = (id: string) => {
      const view = render(
        <div>
          <button>First</button>
          <button>Middle</button>
          <button>Last</button>
        </div>,
      );
      const [first, middle, last] = view.container.querySelectorAll('button');
      return {
        ...view,
        first,
        middle,
        last,
        unlock: lockFocus(view.container, id),
      };
    };

    it.each([false, true])(
      'wraps immediately without another focusin event (shift=%s)',
      shiftKey => {
        const { first, last, unlock } = renderLock('boundary');
        try {
          const target = shiftKey ? last : first;
          (shiftKey ? first : last).focus();
          const focusSpy = jest.spyOn(target, 'focus');
          const event = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey,
            bubbles: true,
            cancelable: true,
          });

          document.activeElement.dispatchEvent(event);

          expect(event.defaultPrevented).toBe(true);
          expect(document.activeElement).toBe(target);
          expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
        } finally {
          unlock();
        }
      },
    );

    it.each([false, true])(
      'leaves interior Tab navigation to the browser (shift=%s)',
      shiftKey => {
        const { middle, unlock } = renderLock('interior');
        try {
          middle.focus();
          expect(fireEvent.keyDown(middle, { key: 'Tab', shiftKey })).toBe(
            true,
          );
          expect(document.activeElement).toBe(middle);
        } finally {
          unlock();
        }
      },
    );

    it.each(['composing', 'prevented', 'other key'])(
      'does not handle %s events',
      kind => {
        const { last, unlock } = renderLock('ignored-key');
        try {
          last.focus();
          const event = new KeyboardEvent('keydown', {
            key: kind === 'other key' ? 'ArrowDown' : 'Tab',
            isComposing: kind === 'composing',
            bubbles: true,
            cancelable: true,
          });
          if (kind === 'prevented') event.preventDefault();

          last.dispatchEvent(event);

          expect(event.defaultPrevented).toBe(kind === 'prevented');
          expect(document.activeElement).toBe(last);
        } finally {
          unlock();
        }
      },
    );

    it.each([false, true])(
      'keeps a single focusable element focused (shift=%s)',
      shiftKey => {
        const { container, getByRole } = render(<button>Only</button>);
        const unlock = lockFocus(container, 'single');
        try {
          const button = getByRole('button', { name: 'Only' });
          expect(fireEvent.keyDown(button, { key: 'Tab', shiftKey })).toBe(
            false,
          );
          expect(document.activeElement).toBe(button);
        } finally {
          unlock();
        }
      },
    );

    it('wraps only the latest lock and restores the previous lock after cleanup', () => {
      const outer = renderLock('outer');
      const inner = renderLock('inner');
      try {
        inner.last.focus();
        expect(fireEvent.keyDown(inner.last, { key: 'Tab' })).toBe(false);
        expect(document.activeElement).toBe(inner.first);

        inner.unlock();
        inner.unmount();
        outer.last.focus();
        expect(fireEvent.keyDown(outer.last, { key: 'Tab' })).toBe(false);
        expect(document.activeElement).toBe(outer.first);

        outer.unlock();
        expect(
          fireEvent.keyDown(outer.first, { key: 'Tab', shiftKey: true }),
        ).toBe(true);
      } finally {
        inner.unlock();
        outer.unlock();
      }
    });
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

    it('should retry lock once when element is filled after lock starts', async () => {
      const DelayedElementComponent: React.FC = () => {
        const elementRef = useRef<HTMLDivElement>(null);
        const [element, setElement] = useState<HTMLDivElement | null>(null);

        useLockFocus(true, () => element);

        useEffect(() => {
          setElement(elementRef.current);
        }, []);

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

      const { getByTestId } = render(<DelayedElementComponent />);

      const focusContainer = getByTestId('focus-container');

      await waitFor(() => {
        expect(document.activeElement).toBe(focusContainer);
      });
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
