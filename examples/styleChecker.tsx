import React from 'react';
import { isStyleSupport, isStyleValueSupport } from '../src/Dom/styleChecker';

export default () => {
  const supportFlex = isStyleSupport('flex');
  const supportSticky = isStyleValueSupport('position', 'sticky');
  const supportNotExistValue = isStyleValueSupport('position', 'sticky2');

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
