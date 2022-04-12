import type * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';

const { version, render: reactRender, unmountComponentAtNode } = ReactDOM;

let createRoot: (container: ContainerType) => Root;
try {
  const mainVersion = Number((version || '').split('.')[0]);
  if (mainVersion >= 18) {
    ({ createRoot } = ReactDOM as any);

    const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } =
      ReactDOM as any;
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint =
      true;
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
