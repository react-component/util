let cached;

export default function getScrollBarSize(fresh) {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = 0;
    outerStyle.left = 0;
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }
  return cached;
}

export const getScrollBarSizeFunc = () => (
  document.body.scrollHeight >
    (window.innerHeight || document.documentElement.clientHeight) &&
    (window.innerWidth || document.documentElement.clientWidth) > document.body.offsetWidth
    ? getScrollBarSize(true)// router 切换时可能会导至页面失去滚动条，所以需要时时获取。
    : 0
);

export const switchScrollingEffect = (close) => {
  const scrollBarSize = getScrollBarSizeFunc();
  if (scrollBarSize) {
    if (close) {
      document.body.style.position = '';
      document.body.style.width = '';
    } else {
      document.body.style.position = 'relative';
      document.body.style.width = `calc(100% - ${scrollBarSize}px)`;
    }
  }
};
