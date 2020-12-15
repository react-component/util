import * as React from 'react';

export interface SetStyleOptions {
  element?: HTMLElement;
}

/**
 * Easy to set element style, return previous style
 * IE browser compatible(IE browser doesn't merge overflow style, need to set it separately)
 * https://github.com/ant-design/ant-design/issues/19393
 *
 */
function setStyle(
  style: React.CSSProperties,
  options: SetStyleOptions = {},
): React.CSSProperties {
  if (!style) {
    return {};
  }

  const { element = document.body } = options;
  const oldStyle: React.CSSProperties = {};

  const styleKeys = Object.keys(style);

  // IE browser compatible
  styleKeys.forEach(key => {
    oldStyle[key] = element.style[key];
  });

  styleKeys.forEach(key => {
    element.style[key] = style[key];
  });

  return oldStyle;
}

export default setStyle;
