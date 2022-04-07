import type * as React from 'react';
import {
  version,
  render as reactRender,
  unmountComponentAtNode,
} from 'react-dom';
import type { Root } from 'react-dom/client';

let createRoot: (container: ContainerType) => Root;
try {
  const mainVersion = Number((version || '').split('.')[0]);
  if (mainVersion >= 18) {
    ({ createRoot } = require('react-dom/client'));
  }
} catch (e) {
  // Do nothing;
}

const MARK = '__rc_react_root__';

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
};

function modernRender(node: React.ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container);
  root.render(node);

  container[MARK] = root;
}

function legacyRender(node: React.ReactElement, container: ContainerType) {
  reactRender(node, container);
}

/** @private Test usage. Not work in prod */
export function _r(node: React.ReactElement, container: ContainerType) {
  if (process.env.NODE_ENV !== 'production') {
    return legacyRender(node, container);
  }
}

export function render(node: React.ReactElement, container: ContainerType) {
  if (createRoot) {
    modernRender(node, container);
    return;
  }

  legacyRender(node, container);
}

// ========================= Unmount ==========================
async function modernUnmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();

    delete container[MARK];
  });
}

function legacyUnmount(container: ContainerType) {
  unmountComponentAtNode(container);
}

/** @private Test usage. Not work in prod */
export function _u(container: ContainerType) {
  if (process.env.NODE_ENV !== 'production') {
    return legacyUnmount(container);
  }
}

export async function unmount(container: ContainerType) {
  if (createRoot !== undefined) {
    // Delay to unmount to avoid React 18 sync warning
    return modernUnmount(container);
  }

  legacyUnmount(container);
}
