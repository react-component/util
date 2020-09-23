import React from 'react';
import PortalWrapper from '../src/PortalWrapper';

export default () => {
  return (
    <>
      <PortalWrapper forceRender>{() => <div>2333</div>}</PortalWrapper>
    </>
  );
};
