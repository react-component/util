export default (element: HTMLElement | SVGGraphicsElement): boolean => {
  if (!element) {
    return false;
  }

  if (element instanceof HTMLElement && element.offsetParent) {
    return true;
  }

  if (element instanceof SVGGraphicsElement && element.getBBox) {
    const { width, height } = element.getBBox();
    if (width || height) {
      return true;
    }
  }

  if (element instanceof HTMLElement && element.getBoundingClientRect) {
    const { width, height } = element.getBoundingClientRect();
    if (width || height) {
      return true;
    }
  }

  return false;
};
