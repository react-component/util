import type * as React from 'react';
import { isValidElement, version } from 'react';
import { ForwardRef, isMemo } from 'react-is';
import useMemo from './hooks/useMemo';
import isFragment from './React/isFragment';

const ReactMajorVersion = Number(version.split('.')[0]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
    (prev, next) =>
      prev.length !== next.length || prev.every((ref, i) => ref !== next[i]),
  );
};

export const supportRef = (nodeOrComponent: any): boolean => {
  if (!nodeOrComponent) {
    return false;
  }

  // React 19 no need `forwardRef` anymore. So just pass if is a React element.
  if (isReactElement(nodeOrComponent) && ReactMajorVersion >= 19) {
    return true;
  }

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

function isReactElement(node: React.ReactNode) {
  return isValidElement(node) && !isFragment(node);
}

export const supportNodeRef = <T = any>(
  node: React.ReactNode,
): node is React.ReactElement & RefAttributes<T> => {
  return isReactElement(node) && supportRef(node);
};

/**
 * In React 19. `ref` is not a property from node.
 * But a property from `props.ref`.
 * In < React 19, `ref` lives on the element itself (`element.ref`).
 */
export const getNodeRef: <T = any>(
  node: React.ReactNode,
) => React.Ref<T> | null = node => {
  if (node && isReactElement(node)) {
    const ele = node as any;
    // React 19: `ref` is a regular prop and reading `element.ref` triggers a
    // deprecation warning, even when the prop is absent. Branch on the React
    // major version to avoid touching `element.ref` on React 19+.
    return ReactMajorVersion >= 19
      ? (ele.props.ref ?? null)
      : (ele.ref ?? null);
  }
  return null;
};
