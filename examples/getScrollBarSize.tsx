/* eslint-disable react/no-danger */

import React from 'react';
import getScrollBarSize, {
  getTargetScrollBarSize,
} from '../src/getScrollBarSize';

export default () => {
  const divRef = React.useRef<HTMLDivElement>();
  const [sizeData, setSizeData] = React.useState('');

  React.useEffect(() => {
    const originSize = getScrollBarSize();
    const targetSize = getTargetScrollBarSize(divRef.current);

    setSizeData(
      `Origin: ${originSize}, Target: ${targetSize.width}/${targetSize.height}`,
    );
  }, []);

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #customizeContainer::-webkit-scrollbar {
              width: 2em;
              height: 23px;
              background: blue;
            }

            #customizeContainer::-webkit-scrollbar-thumb {
              background: red;
              height: 30px;
            }
          `,
        }}
      />
      <div
        style={{ width: 100, height: 100, overflow: 'auto' }}
        id="customizeContainer"
        ref={divRef}
      >
        <div style={{ width: '100vw', height: '100vh', background: 'green' }}>
          Hello World!
        </div>
      </div>

      <div
        style={{
          width: 100,
          height: 100,
          overflow: 'scroll',
          background: 'yellow',
        }}
      />

      <pre>{sizeData}</pre>
    </div>
  );
};
