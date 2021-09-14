import canUseDom from './canUseDom';

export const isStyleSupport = (styleName: string | string[]): boolean => {
  if (canUseDom() && window.document.documentElement) {
    const styleNameList = Array.isArray(styleName) ? styleName : [styleName];
    const { documentElement } = window.document;

    return styleNameList.some(name => name in documentElement.style);
  }
  return false;
};

export const isStyleValueSupport = (styleName: string, value: any) => {
  if (!isStyleSupport(styleName)) {
    return false;
  }

  const ele = document.createElement('div');
  const origin = ele.style[styleName];
  ele.style[styleName] = value;
  return ele.style[styleName] !== origin;
};
