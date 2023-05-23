export function inShadow(ele: Node) {
  return ele?.getRootNode() !== ele?.ownerDocument;
}

export function getShadowRoot(ele: Node) {
  return inShadow(ele) ? ele?.getRootNode() : null;
}
