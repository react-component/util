import getScrollBarSize from '../getScrollBarSize';
import setStyle from '../setStyle';

export interface scrollLockOptions {
  container: HTMLElement;
}

interface Ilocks {
  target: HTMLElement;
  cacheStyle?: React.CSSProperties;
  options: scrollLockOptions;
}

let locks: Ilocks[] = [];
const scrollingEffectClassName = 'ant-scrolling-effect';
const scrollingEffectClassNameReg = new RegExp(
  `${scrollingEffectClassName}`,
  'g',
);

export function lock(
  lockTarget: HTMLElement,
  targetOptions?: scrollLockOptions,
) {
  // If lockTarget exist, return
  if (locks.some(({ target }) => target === lockTarget)) {
    return;
  }

  // If same container effect, return
  if (
    locks.some(({ options }) => options?.container === targetOptions?.container)
  ) {
    locks = [...locks, { target: lockTarget, options: targetOptions }];
    return;
  }

  // Add Effect
  const scrollBarSize = getScrollBarSize();

  const container = targetOptions?.container || document.body;
  const containerClassName = container.className;

  const cacheStyle = setStyle(
    {
      position: 'relative',
      width: `calc(100% - ${scrollBarSize}px)`,
    },
    {
      element: container,
    },
  );

  // https://github.com/ant-design/ant-design/issues/19729
  if (!scrollingEffectClassNameReg.test(containerClassName)) {
    const addClassName = `${containerClassName} ${scrollingEffectClassName}`;
    container.className = addClassName.trim();
  }

  locks = [
    ...locks,
    { target: lockTarget, options: targetOptions, cacheStyle },
  ];
}

export function unLock(lockTarget: HTMLElement) {
  const findLock = locks.find(({ target }) => target === lockTarget);

  locks = locks.filter(({ target }) => target !== lockTarget);

  if (
    !findLock ||
    locks.some(
      ({ options }) => options?.container === findLock.options?.container,
    )
  ) {
    return;
  }

  // Remove Effect
  const container = findLock.options?.container || document.body;
  const containerClassName = container.className;

  if (!scrollingEffectClassNameReg.test(containerClassName)) return;
  setStyle(findLock.cacheStyle, { element: container });
  container.className = container.className
    .replace(scrollingEffectClassNameReg, '')
    .trim();
}

const scrollLocker = {
  lock,
  unLock,
};

export default scrollLocker;
