import type * as React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

const MARK = '__rc_react_root__';
const MARK_ID = '__rc_react_root_id__';

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
  [MARK_ID]?: number;
};

export function render(node: React.ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container);

  root.render(node);

  container[MARK] = root;
  container[MARK_ID] = (container[MARK_ID] || 0) + 1;
}

// ========================= Unmount ==========================
export async function unmount(container: ContainerType) {
  const root = container[MARK];
  const rootId = container[MARK_ID];
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    if (container[MARK] === root && container[MARK_ID] === rootId) {
      root?.unmount();
      delete container[MARK];
      delete container[MARK_ID];
    }
  });
}
