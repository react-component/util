import React from 'react';

export function isDOM(node: any): node is HTMLElement | SVGElement {
  // https://developer.mozilla.org/en-US/docs/Web/API/Element
  // Since XULElement is also subclass of Element, we only need HTMLElement and SVGElement
  return node instanceof HTMLElement || node instanceof SVGElement;
}

/**
 * Retrieves a DOM node via a ref, and does not invoke `findDOMNode`.
 */
export function getDOM(node: any): HTMLElement | SVGElement | null {
  if (node && typeof node === 'object' && isDOM(node.nativeElement)) {
    return node.nativeElement;
  }

  if (isDOM(node)) {
    return node as any;
  }

  return null;
}

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */
export default function findDOMNode<T = Element | Text>(
  node:
    | React.ReactInstance
    | HTMLElement
    | SVGElement
    | { nativeElement: T }
    | { current: T },
): T | null {
  const domNode = getDOM(node);
  if (domNode) {
    return domNode as T;
  }

  if (node && typeof node === 'object' && 'current' in node) {
    const refDomNode = getDOM(node.current);
    if (refDomNode) {
      return refDomNode as T;
    }
  }

  return null;
}
