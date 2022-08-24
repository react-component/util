import canUseDOM from './canUseDom';
const animationEndEventNames = {
  WebkitAnimation: 'webkitAnimationEnd',
  OAnimation: 'oAnimationEnd',
  animation: 'animationend',
};
const transitionEventNames = {
  WebkitTransition: 'webkitTransitionEnd',
  OTransition: 'oTransitionEnd',
  transition: 'transitionend',
};

function supportEnd(names) {
  const el = document.createElement('div');
  for (const name in names) {
    if (names.hasOwnProperty(name) && el.style[name] !== undefined) {
      return {
        end: names[name],
      };
    }
  }
  return false;
}

export const animation = canUseDOM() && supportEnd(animationEndEventNames);
export const transition = canUseDOM() && supportEnd(transitionEventNames);
