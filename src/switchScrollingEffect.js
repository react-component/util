import getScrollBarSize from './getScrollBarSize';

export default close => {
  const bodyIsOverflowing =
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth;
  if (!bodyIsOverflowing) {
    return;
  }

  // https://github.com/ant-design/ant-design/issues/19729
  const scrollingEffectClassName = 'switch-scrolling-effect';
  const scrollingEffectClassNameReg = new RegExp(`${scrollingEffectClassName}`, 'g');
  const bodyClassName = document.body.className;
  if (close) {
    document.body.style.position = '';
    document.body.style.width = '';
    if (scrollingEffectClassNameReg.test(bodyClassName)) {
      document.body.className = bodyClassName.replace(scrollingEffectClassNameReg, '').trim();
    }
    return;
  }
  const scrollBarSize = getScrollBarSize();
  if (scrollBarSize) {
    document.body.style.position = 'relative';
    document.body.style.width = `calc(100% - ${scrollBarSize}px)`;
    if (!scrollingEffectClassNameReg.test(bodyClassName)) {
      document.body.className = `${bodyClassName} ${scrollingEffectClassName}`;
    }
  }
};
