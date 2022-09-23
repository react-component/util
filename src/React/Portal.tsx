import * as React from 'react';
import { createPortal } from 'react-dom';

// ZombieJ: Since React 18 strict mode logic change.
//          We should rewrite for compatible.

export interface PortalProps {
  getContainer?: () => Element | DocumentFragment;
  children?: React.ReactNode;
  open?: boolean;
  forceRender?: boolean;
}

export default function Portal(props: PortalProps) {
  const { open, forceRender, getContainer, children } = props;

  const [shouldRender, setShouldRender] = React.useState(open || forceRender);

  const container = React.useMemo(() => {
    if (getContainer) {
      return getContainer();
    }

    const element = document.createElement('div');
    document.body.append(element);
    return document.body;
  }, [getContainer]);

  React.useEffect(
    () => () => {
      container.parentNode.removeChild(container);
    },
    [],
  );

  // return createPortal(children, container);

  // Do not render when nothing need render
  if (!shouldRender) {
    return null;
  }

  return createPortal(children, container);
}
