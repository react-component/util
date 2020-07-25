/* eslint-disable no-param-reassign */
import * as React from 'react';
import { isMemo } from 'react-is';

export function fillRef<T>(ref: React.Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as any).current = node;
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  return (node: T) => {
    refs.forEach(ref => {
      fillRef(ref, node);
    });
  };
}

export function supportRef(nodeOrComponent: any): boolean {
  const type = isMemo(nodeOrComponent)
    ? nodeOrComponent.type.type
    : nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !type.prototype?.render) {
    return false;
  }

  // Class component
  if (
    typeof nodeOrComponent === 'function' &&
    !nodeOrComponent.prototype?.render
  ) {
    return false;
  }

  return true;
}
/* eslint-enable */
