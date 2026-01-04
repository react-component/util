import React from 'react';
import PortalWrapper from 'rc-util/es/PortalWrapper';

const Demo: React.FC = () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const outerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.log('>>>', divRef.current);
  }, []);

  function getRef() {
    return outerRef.current;
  }

  return (
    <>
      <PortalWrapper visible getContainer={getRef}>
        {() => <div ref={divRef}>2333</div>}
      </PortalWrapper>
      <div style={{ backgroundColor: 'red', height: 20 }} ref={outerRef} />
    </>
  );
};

export default Demo;
