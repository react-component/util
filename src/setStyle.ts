import * as React from 'react';

export interface SetStyleOptions {
  element?: HTMLElement;
}

/**
 * Easy to set element style, return previou style
 * IE browser compatible(IE browser doesn't merge overflow style, need to set it separately)
 * https://github.com/ant-design/ant-design/issues/19393
 *
 */
function setStyle(
  style: React.CSSProperties,
  options: SetStyleOptions = {},
): React.CSSProperties {
  const { element = document.body } = options;
  const oldStyle: React.CSSProperties = {};

  // IE browser compatible
  Object.keys(style).forEach(key => {
    oldStyle[key] = element.style[key];
  });

  Object.keys(style).forEach(key => {
    element.style[key] = style[key];
  });

  return oldStyle;
}

export default setStyle;
