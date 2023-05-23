export function inShadow(ele: Node) {
  return ele?.getRootNode() !== ele?.ownerDocument;
}

export function getShadowRoot(ele: Node): ShadowRoot {
  return inShadow(ele) ? (ele?.getRootNode() as ShadowRoot) : null;
}
