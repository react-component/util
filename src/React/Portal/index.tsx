import * as React from 'react';
import { createPortal } from 'react-dom';
import useEvent from '../../hooks/useEvent';
import useLayoutEffect from '../../hooks/useLayoutEffect';
import useDom from './useDom';

// ZombieJ: Since React 18 strict mode logic change.
//          We should rewrite for compatible.

export interface PortalProps {
  getContainer?: () => Element | DocumentFragment;
  children?: React.ReactNode;
  open?: boolean;
  forceRender?: boolean;
  /** @private Debug usage */
  debugMark?: React.ReactNode;
}

function shouldRender(open?: boolean, forceRender?: boolean) {
  return !!(open || forceRender);
}

export default function Portal(props: PortalProps) {
  const { open, forceRender, getContainer, children, debugMark } = props;

  const [mergedRender, setMergedRender] = React.useState(
    shouldRender(open, forceRender),
  );

  // ====================== Should Render ======================
  React.useEffect(() => {
    setMergedRender(shouldRender(open, forceRender));
  }, [open, forceRender]);

  // ======================== Container ========================
  // const containerRef = React.useRef<Element>();
  const [defaultContainer] = React.useState(() =>
    document.createElement('div'),
  );

  const customizeContainer = getContainer?.();

  const container: Element | DocumentFragment =
    getContainer?.() ?? defaultContainer;

  // =========================== DOM ===========================
  const appendDom = useEvent(() => {
    if (
      mergedRender &&
      container === defaultContainer &&
      !defaultContainer.parentNode
    ) {
      document.body.appendChild(defaultContainer);
    }
  });

  function cleanup() {
    document.body.removeChild(defaultContainer);
  }

  useLayoutEffect(() => {
    if (mergedRender) {
      appendDom();
    } else {
      cleanup();
    }
  }, [mergedRender]);

  React.useEffect(() => cleanup, []);

  useDom(mergedRender && !customizeContainer);

  // ========================= Render ==========================
  // Do not render when nothing need render
  if (!mergedRender) {
    return null;
  }

  let node = children;
  if (debugMark) {
    node = (
      <>
        {debugMark}
        {node}
      </>
    );
  }

  return createPortal(node, container);
}
