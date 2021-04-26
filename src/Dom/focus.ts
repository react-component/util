function hidden(node: HTMLElement) {
  return node.style.display === 'none';
}

function visible(node: HTMLElement) {
  let current = node;

  while (current) {
    if (current === document.body) {
      break;
    }
    if (hidden(current)) {
      return false;
    }
    current = current.parentNode as HTMLElement;
  }
  return true;
}

function focusable(node: HTMLElement): boolean {
  const nodeName = node.nodeName.toLowerCase();
  const tabIndex = parseInt(node.getAttribute('tabindex'), 10);
  const hasTabIndex = !Number.isNaN(tabIndex) && tabIndex > -1;

  if (visible(node)) {
    if (['input', 'select', 'textarea', 'button'].indexOf(nodeName) > -1) {
      return !(node as any).disabled;
    }

    if (nodeName === 'a') {
      return !!node.getAttribute('href') || hasTabIndex;
    }

    return node.isContentEditable || hasTabIndex;
  }

  return false;
}

export function getFocusNodeList(node: HTMLElement) {
  const res = [...node.querySelectorAll('*')].filter(child => {
    return focusable(child as HTMLElement);
  });
  if (focusable(node)) {
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
