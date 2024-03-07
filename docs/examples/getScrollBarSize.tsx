import getScrollBarSize, {
  getTargetScrollBarSize,
} from 'rc-util/es/getScrollBarSize';
import React from 'react';

const cssText = `
#customizeContainer::-webkit-scrollbar {
  width: 2em;
  height: 23px;
  background: blue;
}

#customizeContainer::-webkit-scrollbar-thumb {
  background: red;
  height: 30px;
}

#scrollContainer {
  scrollbar-color: red orange;
  scrollbar-width: thin;
}
`;

export default () => {
  const defaultRef = React.useRef<HTMLDivElement>();
  const webkitRef = React.useRef<HTMLDivElement>();
  const scrollRef = React.useRef<HTMLDivElement>();
  const [sizeData, setSizeData] = React.useState('');

  React.useEffect(() => {
    const originSize = getScrollBarSize();
    const defaultSize = getTargetScrollBarSize(defaultRef.current);
    const webkitSize = getTargetScrollBarSize(webkitRef.current);
    const scrollSize = getTargetScrollBarSize(scrollRef.current);

    setSizeData(
      [
        `Origin: ${originSize}`,
        `Default: ${defaultSize.width}/${defaultSize.height}`,
        `Webkit: ${webkitSize.width}/${webkitSize.height}`,
        `Scroll: ${scrollSize.width}/${scrollSize.height}`,
      ].join(', '),
    );
  }, []);

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: cssText,
        }}
      />

      <div
        style={{
          width: 300,
          height: 100,
          overflow: 'scroll',
          background: 'yellow',
        }}
        ref={defaultRef}
      >
        Origin
      </div>

      <div
        style={{ width: 300, height: 100, overflow: 'auto' }}
        id="customizeContainer"
        ref={webkitRef}
      >
        <div style={{ width: '200vw', height: '200vh', background: 'yellow' }}>
          Customize `-webkit-scrollbar`
        </div>
      </div>

      <div
        style={{ width: 300, height: 100, overflow: 'auto' }}
        id="scrollContainer"
        ref={scrollRef}
      >
        <div style={{ width: '200vw', height: '200vh', background: 'yellow' }}>
          scrollbar-style
        </div>
      </div>

      <pre>{sizeData}</pre>
    </div>
  );
};
