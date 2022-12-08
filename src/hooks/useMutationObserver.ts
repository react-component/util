import { useEffect, useRef } from 'react';

const useMutationObserver = () => {
  const instance = useRef<MutationObserver>();

  const destroyObserver = () => {
    if (instance.current) {
      instance.current.takeRecords();
      instance.current.disconnect();
      instance.current = undefined;
    }
  };

  const createObserver = (target: Node, callback: MutationCallback) => {
    if ('MutationObserver' in window) {
      destroyObserver();
      instance.current = new MutationObserver(callback);
      instance.current.observe(target, {
        childList: true,
        subtree: true,
        attributeFilter: ['style', 'class'],
      });
    }
  };

  useEffect(() => destroyObserver, []);

  return { createObserver, destroyObserver };
};

export default useMutationObserver;
