import React from 'react';
import { isStyleSupport } from 'rc-util/es/Dom/styleChecker';

export default () => {
  const supportFlex = isStyleSupport('flex');
  const supportSticky = isStyleSupport('position', 'sticky');
  const supportNotExistValue = isStyleSupport('position', 'sticky2');

  return (
    <ul>
      <li key="flex">supportFlex: {String(supportFlex)}</li>
      <li key="sticky">supportSticky: {String(supportSticky)}</li>
      <li key="not-exist">
        supportNotExistValue: {String(supportNotExistValue)}
      </li>
    </ul>
  );
};
