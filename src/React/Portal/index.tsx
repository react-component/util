import * as React from 'react';
import { createPortal } from 'react-dom';
import OrderContext from './Context';
import useDom from './useDom';

// ZombieJ: Since React 18 strict mode logic change.
//          We should rewrite for compatible.

export interface PortalProps {
  getContainer?: () => Element | DocumentFragment;
  children?: React.ReactNode;
  open?: boolean;
  forceRender?: boolean;
}

function shouldRender(open?: boolean, forceRender?: boolean) {
  return !!(open || forceRender);
}

export default function Portal(props: PortalProps) {
  const { open, forceRender, getContainer, children } = props;

  const [mergedRender, setMergedRender] = React.useState(
    shouldRender(open, forceRender),
  );

  // ====================== Should Render ======================
  React.useEffect(() => {
    setMergedRender(shouldRender(open, forceRender));
  }, [open, forceRender]);

  // ======================== Container ========================
  const customizeContainer = getContainer?.();

  const [defaultContainer, queueCreate] = useDom(
    mergedRender && !customizeContainer,
  );
  const mergedContainer = customizeContainer || defaultContainer;

  // ========================= Render ==========================
  // Do not render when nothing need render
  if (!mergedRender) {
    return null;
  }

  return (
    <OrderContext.Provider value={queueCreate}>
      {createPortal(children, mergedContainer)}
    </OrderContext.Provider>
  );
}
