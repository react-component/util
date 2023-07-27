import type { Prepend } from 'rc-util/es/Dom/dynamicCSS';
import { removeCSS, updateCSS } from 'rc-util/es/Dom/dynamicCSS';
import React from 'react';

function injectStyle(id: number, prepend?: Prepend, priority?: number) {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  updateCSS(`body { background: #${randomColor} }`, `style-${id}`, {
    prepend,
    priority,
  });
}

export default () => {
  const [id, setId] = React.useState(0);
  const idRef = React.useRef(id);
  idRef.current = id;

  // Clean up
  React.useEffect(() => {
    return () => {
      for (let i = 0; i <= idRef.current; i += 1) {
        removeCSS(`style-${i}`);
      }
    };
  }, []);

  return (
    <>
      <button
        onClick={() => {
          injectStyle(id, 'queue');
          setId(id + 1);
        }}
      >
        Prepend Queue: {id}
      </button>

      <button
        onClick={() => {
          injectStyle(id, 'queue', -1);
          setId(id + 1);
        }}
      >
        Prepend Queue Priority: {id}
      </button>

      <button
        onClick={() => {
          injectStyle(-1);
        }}
      >
        Append
      </button>
    </>
  );
};
