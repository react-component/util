import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */
export default function findDOMNode<T = Element | Text>(
  node: React.ReactInstance | HTMLElement,
): T {
  if (node instanceof HTMLElement) {
    return node as unknown as T;
  }

  if (node instanceof React.Component) {
    return ReactDOM.findDOMNode(node) as unknown as T;
  }

  return null;
}
