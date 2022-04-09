import type * as React from 'react';
import {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import useLayoutEffect from './hooks/useLayoutEffect';

export type PortalRef = {};

export interface PortalProps {
  didUpdate?: (prevProps: PortalProps) => void;
  getContainer: () => HTMLElement;
  children?: React.ReactNode;
}

const Portal = forwardRef<PortalRef, PortalProps>((props, ref) => {
  const { didUpdate, getContainer, children } = props;

  const parentMap = useMemo(() => new WeakMap<HTMLElement, ParentNode>(), []);
  const [portalContainer, setPortalContainer] = useState<HTMLElement>();

  // Ref return nothing, only for wrapper check exist
  useImperativeHandle(ref, () => ({}));

  // [Legacy] Used by `rc-trigger`
  useEffect(() => {
    didUpdate?.(props);
  });

  useLayoutEffect(() => {
    const container = getContainer();
    setPortalContainer(container);

    // Restore container to original place
    // React 18 StrictMode will unmount first and mount back for effect test:
    // https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
    if (container.parentNode === null && parentMap.get(container)) {
      parentMap.get(container).appendChild(container);
    } else {
      parentMap.set(container, container.parentNode);
    }

    return () => {
      // [Legacy] This should not be handle by Portal but parent PortalWrapper instead.
      // Since some component use `Portal` directly, we have to keep the logic here.
      container.parentNode?.removeChild(container);
    };
  }, []);

  return portalContainer
    ? ReactDOM.createPortal(children, portalContainer)
    : null;
});

export default Portal;
