import React from 'react';
import ReactDOM from 'react-dom';

export function isDOM(node: any): node is HTMLElement | SVGElement {
  // https://developer.mozilla.org/en-US/docs/Web/API/Element
  // Since XULElement is also subclass of Element, we only need HTMLElement and SVGElement
  return node instanceof HTMLElement || node instanceof SVGElement;
}

export function extractDomNode(node: any): HTMLElement | null {
  if (node && typeof node === 'object' && isDOM((node as any).nativeElement)) {
    return (node as any).nativeElement as HTMLElement;
  }

  if (isDOM(node)) {
    return node as HTMLElement;
  }

  return null;
}

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */
export default function findDOMNode<T = Element | Text>(
  node: React.ReactInstance | HTMLElement | SVGElement | { nativeElement: T },
): T {
  const domNode = extractDomNode(node);
  if (domNode) {
    return domNode as T;
  }

  if (node instanceof React.Component) {
    return ReactDOM.findDOMNode(node) as unknown as T;
  }

  return null;
}
