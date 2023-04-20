export default (element: Element): boolean => {
  if (!element) {
    return false;
  }

  if (element instanceof Element) {
    if ((element as HTMLElement).offsetParent) {
      return true;
    }

    if ((element as SVGGraphicsElement).getBBox) {
      const { width, height } = (element as SVGGraphicsElement).getBBox();
      if (width || height) {
        return true;
      }
    }

    if (element.getBoundingClientRect) {
      const { width, height } = element.getBoundingClientRect();
      if (width || height) {
        return true;
      }
    }
  }

  return false;
};
