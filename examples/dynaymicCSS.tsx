import React from 'react';
import { updateCSS, removeCSS } from '../src/Dom/dynamicCSS';

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
    <button
      onClick={() => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        updateCSS(`body { background: #${randomColor} }`, `style-${id}`, {
          prepend: 'queue',
        });
        setId(id + 1);
      }}
    >
      Inject: {id}
    </button>
  );
};
