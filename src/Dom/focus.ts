import { useEffect } from 'react';
import isVisible from './isVisible';
import useId from '../hooks/useId';

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
// Map stable ID to lock element
const idToElementMap = new Map<string, HTMLElement>();
// Map stable ID to ignored element
const ignoredElementMap = new Map<string, HTMLElement | null>();

function getLastElement() {
  return focusElements[focusElements.length - 1];
}

function isIgnoredElement(element: Element | null): boolean {
  const lastElement = getLastElement();

  if (element && lastElement) {
    // Find the ID that maps to the last element
    let lockId: string | undefined;
    for (const [id, ele] of idToElementMap.entries()) {
      if (ele === lastElement) {
        lockId = id;
        break;
      }
    }

    const ignoredEle = ignoredElementMap.get(lockId);
    return (
      !!ignoredEle && (ignoredEle === element || ignoredEle.contains(element))
    );
  }

  return false;
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
      : // https://github.com/ant-design/ant-design/issues/56963
        // lastElement may not be focusable, so we need to check if it is focusable and then focus it
        focusable(lastElement)
        ? lastElement
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
 * @param id - A stable ID for this lock instance
 */
export function lockFocus(element: HTMLElement, id: string): VoidFunction {
  if (element) {
    // Store the mapping between ID and element
    idToElementMap.set(id, element);

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
    idToElementMap.delete(id);
    ignoredElementMap.delete(id);
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
  const id = useId();

  useEffect(() => {
    if (lock) {
      const element = getElement();
      if (element) {
        return lockFocus(element, id);
      }
    }
  }, [lock, id]);

  const ignoreElement = (ele: HTMLElement) => {
    if (ele) {
      // Set the ignored element using stable ID
      ignoredElementMap.set(id, ele);
    }
  };

  return [ignoreElement];
}
