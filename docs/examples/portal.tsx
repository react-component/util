import React from 'react';
import PortalWrapper from 'rc-util/es/PortalWrapper';

export default () => {
  const divRef = React.useRef();
  const outerRef = React.useRef();

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
      <div style={{ background: 'red', height: 20 }} ref={outerRef} />
    </>
  );
};
