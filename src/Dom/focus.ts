import isVisible from './isVisible';

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
    if (isFocusableElement && (node as any).disabled) {
      tabIndex = null;
    }

    return (
      tabIndex !== null && (tabIndex >= 0 || (includePositive && tabIndex < 0))
    );
  }

  return false;
}

export function getFocusNodeList(node: HTMLElement, includePositive = false) {
  const res = [...node.querySelectorAll('*')].filter(child => {
    return focusable(child as HTMLElement, includePositive);
  });
  if (focusable(node, includePositive)) {
    res.unshift(node);
  }
  return res as HTMLElement[];
}

let lastFocusElement = null;

/** @deprecated Do not use since this may failed when used in async */
export function saveLastFocusNode() {
  lastFocusElement = document.activeElement;
}

/** @deprecated Do not use since this may failed when used in async */
export function clearLastFocusNode() {
  lastFocusElement = null;
}

/** @deprecated Do not use since this may failed when used in async */
export function backLastFocusNode() {
  if (lastFocusElement) {
    try {
      // 元素可能已经被移动了
      lastFocusElement.focus();

      /* eslint-disable no-empty */
    } catch (e) {
      // empty
    }
    /* eslint-enable no-empty */
  }
}

export function limitTabRange(node: HTMLElement, e: KeyboardEvent) {
  if (e.keyCode === 9) {
    const tabNodeList = getFocusNodeList(node);
    const lastTabNode = tabNodeList[e.shiftKey ? 0 : tabNodeList.length - 1];
    const leavingTab =
      lastTabNode === document.activeElement || node === document.activeElement;

    if (leavingTab) {
      const target = tabNodeList[e.shiftKey ? tabNodeList.length - 1 : 0];
      target.focus();
      e.preventDefault();
    }
  }
}
