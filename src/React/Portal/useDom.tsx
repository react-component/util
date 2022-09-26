import * as React from 'react';
import useLayoutEffect from '../../hooks/useLayoutEffect';

/**
 * Will add `div` to document. Nest call will keep order
 * @param render Render DOM in document
 */
export default function useDom(render: boolean) {
  const [ele] = React.useState(() => {
    const defaultEle = document.createElement('div');
    defaultEle.id = 'default';
    return defaultEle;
  });

  useLayoutEffect(() => {
    if (render) {
      if (!ele.parentElement) {
        console.log('??!!!');
        document.body.appendChild(ele);
      } else {
        ele.parentElement?.removeChild(ele);
      }
    }
  }, [ele, render]);


  return ele;
}
