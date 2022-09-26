import * as React from 'react';
import useLayoutEffect from '../../hooks/useLayoutEffect';
import OrderContext from './Context';
import type { QueueCreate } from './Context';

const EMPTY_LIST = [];

/**
 * Will add `div` to document. Nest call will keep order
 * @param render Render DOM in document
 */
export default function useDom(render: boolean): [HTMLDivElement, QueueCreate] {
  const [ele] = React.useState(() => {
    const defaultEle = document.createElement('div');
    defaultEle.id = 'default';
    return defaultEle;
  });

  // ========================== Order ==========================
  const queueCreate = React.useContext(OrderContext);
  const [queue, setQueue] = React.useState<VoidFunction[]>(EMPTY_LIST);

  const mergedQueueCreate =
    queueCreate ||
    ((appendFn: VoidFunction) => {
      setQueue(origin => [...origin, appendFn]);
    });

  // =========================== DOM ===========================
  function append() {
    if (!ele.parentElement) {
      document.body.appendChild(ele);
    }
  }

  function cleanup() {
    ele.parentElement?.removeChild(ele);
  }

  useLayoutEffect(() => {
    if (render) {
      if (queueCreate) {
        queueCreate(append);
      } else {
        append();
      }
    } else {
      cleanup();
    }

    return cleanup;
  }, [render]);

  useLayoutEffect(() => {
    if (queue.length) {
      queue.forEach(appendFn => appendFn());
      setQueue(EMPTY_LIST);
    }
  }, [queue]);

  return [ele, mergedQueueCreate];
}
