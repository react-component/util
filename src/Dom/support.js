const canUseDOM = require('./canUseDom');
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

const support = exports;

if (canUseDOM()) {
  support.animation = supportEnd(animationEndEventNames);
  support.transition = supportEnd(transitionEventNames);
} else {
  support.animation = false;
  support.transition = false;
}
