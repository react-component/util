function getRoot(ele: Node) {
  return ele?.getRootNode?.();
}

/**
 * Check if is in shadowRoot
 */
export function inShadow(ele: Node) {
  return getRoot(ele) !== ele?.ownerDocument;
}

/**
 * Return shadowRoot if possible
 */
export function getShadowRoot(ele: Node): ShadowRoot {
  return inShadow(ele) ? (getRoot(ele) as ShadowRoot) : null;
}
