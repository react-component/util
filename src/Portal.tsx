import * as React from 'react';
import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import canUseDom from './Dom/canUseDom';

export type PortalRef = {};

export interface PortalProps {
  /** @deprecated Not know who use this? */
  didUpdate?: (prevProps: PortalProps) => void;
  getContainer: () => HTMLElement;
  children?: React.ReactNode;
}

const Portal = forwardRef<PortalRef, PortalProps>((props, ref) => {
  const { didUpdate, getContainer, children } = props;

  const containerRef = useRef<HTMLElement>();

  // Ref return nothing, only for wrapper check exist
  useImperativeHandle(ref, () => ({}));

  // Create container in client side with sync to avoid useEffect not get ref
  const initRef = useRef(false);
  if (!initRef.current && canUseDom()) {
    containerRef.current = getContainer();
    initRef.current = true;
  }

  useEffect(() => {
    // Not know who use this. Just keep it here
    didUpdate?.(props);

    return () => {
      if (containerRef.current) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, []);

  return containerRef.current
    ? ReactDOM.createPortal(children, containerRef.current)
    : null;
});

export default Portal;
