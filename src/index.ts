// Hooks exports
export { default as useEvent } from './hooks/useEvent';
export { default as useEffect } from './hooks/useEffect';
export { default as useId } from './hooks/useId';
export { resetUuid } from './hooks/useId';
export { default as useLayoutEffect } from './hooks/useLayoutEffect';
export { useLayoutUpdateEffect } from './hooks/useLayoutEffect';
export { default as useMemo } from './hooks/useMemo';
export { default as useMergedState } from './hooks/useMergedState';
export { default as useMobile } from './hooks/useMobile';
export { default as useState } from './hooks/useState';
export { default as useSyncState } from './hooks/useSyncState';

// Hook types
export type { SetState } from './hooks/useState';
export type { SetState as SyncSetState } from './hooks/useSyncState';

// Ref utilities
export {
  supportNodeRef,
  supportRef,
  useComposeRef,
  fillRef,
  composeRef,
  getNodeRef,
} from './ref';

// Utility functions
export { default as get } from './utils/get';
export { default as set } from './utils/set';
export { merge } from './utils/set';
export { default as warning } from './warning';
export { default as omit } from './omit';
export { default as KeyCode } from './KeyCode';
export { default as isEqual } from './isEqual';
export { default as isMobile } from './isMobile';
export { default as raf } from './raf';
export { default as proxyObject } from './proxyObject';
export { default as setStyle } from './setStyle';
export { default as pickAttrs } from './pickAttrs';
export { default as composeProps } from './composeProps';

// Warning utilities
export {
  preMessage,
  warning as warningFunc,
  note,
  resetWarned,
  call,
  warningOnce,
  noteOnce,
} from './warning';
export type { preMessageFn } from './warning';

// Set utilities types
export type { Path } from './utils/set';

// SetStyle types
export type { SetStyleOptions } from './setStyle';

// PickAttrs types
export type { PickConfig } from './pickAttrs';

// Children utilities
export { default as toArray } from './Children/toArray';
export type { Option as ToArrayOption } from './Children/toArray';

// DOM utilities
export { default as canUseDom } from './Dom/canUseDom';
export { default as contains } from './Dom/contains';
export {
  injectCSS,
  removeCSS,
  clearContainerCache,
  updateCSS,
} from './Dom/dynamicCSS';
export { default as findDOMNode, isDOM, getDOM } from './Dom/findDOMNode';
export {
  getFocusNodeList,
  saveLastFocusNode,
  clearLastFocusNode,
  backLastFocusNode,
  limitTabRange,
} from './Dom/focus';
export { default as isVisible } from './Dom/isVisible';
export { default as ScrollLocker } from './Dom/scrollLocker';
export { inShadow, getShadowRoot } from './Dom/shadow';
export { isStyleSupport } from './Dom/styleChecker';

// DOM types
export type { ContainerType, Prepend, AppendType } from './Dom/dynamicCSS';
export type { scrollLockOptions } from './Dom/scrollLocker';

// React utilities
export { default as isFragment } from './React/isFragment';
export { render, unmount } from './React/render';

// Portal components
export { default as Portal } from './Portal';
export { default as PortalWrapper, getOpenCount } from './PortalWrapper';

// Portal types
export type { PortalRef, PortalProps } from './Portal';
export type { GetContainer, PortalWrapperProps } from './PortalWrapper';

// Scroll utilities
export {
  default as getScrollBarSize,
  getTargetScrollBarSize,
} from './getScrollBarSize';

// Test utilities
export { spyElementPrototypes, spyElementPrototype } from './test/domHook';
export type { ElementClass, Property } from './test/domHook';
