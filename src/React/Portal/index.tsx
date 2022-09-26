import * as React from 'react';
import { createPortal } from 'react-dom';
import OrderContext from './Context';
import useDom from './useDom';
import useScrollLocker from './useScrollLocker';

// ZombieJ: Since React 18 strict mode logic change.
//          We should rewrite for compatible.

export interface PortalProps {
  /** Customize container element. Default will create a div in document.body when `open` */
  getContainer?: () => Element | DocumentFragment;
  children?: React.ReactNode;
  /** Show the portal children */
  open?: boolean;
  /** Lock screen scroll when open */
  autoLock?: boolean;
}

export default function Portal(props: PortalProps) {
  const { open, autoLock, getContainer, children } = props;

  const [mergedRender, setMergedRender] = React.useState(open);

  useScrollLocker(autoLock && open);

  // ====================== Should Render ======================
  React.useEffect(() => {
    setMergedRender(open);
  }, [open]);

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
