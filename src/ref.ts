import type * as React from 'react';
import { isValidElement } from 'react';
import { ForwardRef, isFragment, isMemo } from 'react-is';
import useMemo from './hooks/useMemo';

export const fillRef = <T>(ref: React.Ref<T>, node: T) => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as any).current = node;
  }
};

/**
 * Merge refs into one ref function to support ref passing.
 */
export const composeRef = <T>(...refs: React.Ref<T>[]): React.Ref<T> => {
  const refList = refs.filter(Boolean);
  if (refList.length <= 1) {
    return refList[0];
  }
  return (node: T) => {
    refs.forEach(ref => {
      fillRef(ref, node);
    });
  };
};

export const useComposeRef = <T>(...refs: React.Ref<T>[]): React.Ref<T> => {
  return useMemo(
    () => composeRef(...refs),
    refs,
    (prev, next) =>
      prev.length !== next.length || prev.every((ref, i) => ref !== next[i]),
  );
};

export const supportRef = (nodeOrComponent: any): boolean => {
  const type = isMemo(nodeOrComponent)
    ? nodeOrComponent.type.type
    : nodeOrComponent.type;

  // Function component node
  if (
    typeof type === 'function' &&
    !type.prototype?.render &&
    type.$$typeof !== ForwardRef
  ) {
    return false;
  }

  // Class component
  if (
    typeof nodeOrComponent === 'function' &&
    !nodeOrComponent.prototype?.render &&
    nodeOrComponent.$$typeof !== ForwardRef
  ) {
    return false;
  }
  return true;
};

interface RefAttributes<T> extends React.Attributes {
  ref: React.Ref<T>;
}

export const supportNodeRef = <T = any>(
  node: React.ReactNode,
): node is React.ReactElement & RefAttributes<T> => {
  if (!isValidElement(node)) {
    return false;
  }
  if (isFragment(node)) {
    return false;
  }
  return supportRef(node);
};
