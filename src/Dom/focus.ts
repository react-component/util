import { useEffect } from 'react';
import isVisible from './isVisible';

type DisabledElement =
  | HTMLLinkElement
  | HTMLInputElement
  | HTMLFieldSetElement
  | HTMLButtonElement
  | HTMLOptGroupElement
  | HTMLOptionElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

function focusable(node: HTMLElement, includePositive = false): boolean {
  if (isVisible(node)) {
    const nodeName = node.nodeName.toLowerCase();
    const isFocusableElement =
      // Focusable element
      ['input', 'select', 'textarea', 'button'].includes(nodeName) ||
      // Editable element
      node.isContentEditable ||
      // Anchor with href element
      (nodeName === 'a' && !!node.getAttribute('href'));

    // Get tabIndex
    const tabIndexAttr = node.getAttribute('tabindex');
    const tabIndexNum = Number(tabIndexAttr);

    // Parse as number if validate
    let tabIndex: number = null;
    if (tabIndexAttr && !Number.isNaN(tabIndexNum)) {
      tabIndex = tabIndexNum;
    } else if (isFocusableElement && tabIndex === null) {
      tabIndex = 0;
    }

    // Block focusable if disabled
    if (isFocusableElement && (node as DisabledElement).disabled) {
      tabIndex = null;
    }

    return (
      tabIndex !== null && (tabIndex >= 0 || (includePositive && tabIndex < 0))
    );
  }

  return false;
}

export function getFocusNodeList(node: HTMLElement, includePositive = false) {
  const res = [...node.querySelectorAll<HTMLElement>('*')].filter(child => {
    return focusable(child, includePositive);
  });
  if (focusable(node, includePositive)) {
    res.unshift(node);
  }
  return res;
}

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}

// Used for `rc-input` `rc-textarea` `rc-input-number`
/**
 * Focus element and set cursor position for input/textarea elements.
 */
export function triggerFocus(
  element?: HTMLElement,
  option?: InputFocusOptions,
) {
  if (!element) return;

  element.focus(option);

  // Selection content
  const { cursor } = option || {};
  if (
    cursor &&
    (element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement)
  ) {
    const len = element.value.length;

    switch (cursor) {
      case 'start':
        element.setSelectionRange(0, 0);
        break;

      case 'end':
        element.setSelectionRange(len, len);
        break;

      default:
        element.setSelectionRange(0, len);
    }
  }
}

// ======================================================
// ==                    Lock Focus                    ==
// ======================================================
let lastFocusElement: HTMLElement | null = null;
let focusElements: HTMLElement[] = [];
const ignoredElementMap = new Map<HTMLElement, HTMLElement | null>();

function getLastElement() {
  return focusElements[focusElements.length - 1];
}

function isIgnoredElement(element: Element | null): boolean {
  if (!element) return false;
  const ignoredEle = ignoredElementMap.get(getLastElement());
  return (
    !!ignoredEle && (ignoredEle === element || ignoredEle.contains(element))
  );
}

function hasFocus(element: HTMLElement) {
  const { activeElement } = document;
  return element === activeElement || element.contains(activeElement);
}

function syncFocus() {
  const lastElement = getLastElement();
  const { activeElement } = document;

  // If current focus is on an ignored element, don't force it back
  if (isIgnoredElement(activeElement as HTMLElement)) {
    return;
  }

  if (lastElement && !hasFocus(lastElement)) {
    const focusableList = getFocusNodeList(lastElement);

    const matchElement = focusableList.includes(lastFocusElement as HTMLElement)
      ? lastFocusElement
      : focusableList[0];

    matchElement?.focus({ preventScroll: true });
  } else {
    lastFocusElement = activeElement as HTMLElement;
  }
}

function onWindowKeyDown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    const { activeElement } = document;
    const lastElement = getLastElement();
    const focusableList = getFocusNodeList(lastElement);
    const last = focusableList[focusableList.length - 1];

    if (e.shiftKey && activeElement === focusableList[0]) {
      // Tab backward on first focusable element
      lastFocusElement = last;
    } else if (!e.shiftKey && activeElement === last) {
      // Tab forward on last focusable element
      lastFocusElement = focusableList[0];
    }
  }
}

/**
 * Lock focus in the element.
 * It will force back to the first focusable element when focus leaves the element.
 */
export function lockFocus(element: HTMLElement): VoidFunction {
  if (element) {
    // Refresh focus elements
    focusElements = focusElements.filter(ele => ele !== element);
    focusElements.push(element);

    // Just add event since it will de-duplicate
    window.addEventListener('focusin', syncFocus);
    window.addEventListener('keydown', onWindowKeyDown, true);
    syncFocus();
  }

  // Always return unregister function
  return () => {
    lastFocusElement = null;
    focusElements = focusElements.filter(ele => ele !== element);
    ignoredElementMap.delete(element);
    if (focusElements.length === 0) {
      window.removeEventListener('focusin', syncFocus);
      window.removeEventListener('keydown', onWindowKeyDown, true);
    }
  };
}

/**
 * Lock focus within an element.
 * When locked, focus will be restricted to focusable elements within the specified element.
 * If multiple elements are locked, only the last locked element will be effective.
 * @returns A function to mark an element as ignored, which will temporarily allow focus on that element even if it's outside the locked area.
 */
export function useLockFocus(
  lock: boolean,
  getElement: () => HTMLElement | null,
): [ignoreElement: (ele: HTMLElement) => void] {
  useEffect(() => {
    if (lock) {
      const element = getElement();
      if (element) {
        return lockFocus(element);
      }
    }
  }, [lock]);

  const ignoreElement = (ele: HTMLElement) => {
    const element = getElement();
    if (element && ele) {
      // Set the ignored element for current lock element
      // Only one element can be ignored at a time for this lock
      ignoredElementMap.set(element, ele);
    }
  };

  return [ignoreElement];
}
