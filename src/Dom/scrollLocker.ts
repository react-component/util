import getScrollBarSize from '../getScrollBarSize';
import setStyle from '../setStyle';

export interface scrollLockOptions {
  container: HTMLElement;
}

let uuid = 0;

interface Ilocks {
  target: typeof uuid;
  cacheStyle?: React.CSSProperties;
  options: scrollLockOptions;
}

let locks: Ilocks[] = [];
const scrollingEffectClassName = 'ant-scrolling-effect';
const scrollingEffectClassNameReg = new RegExp(
  `${scrollingEffectClassName}`,
  'g',
);

export default class ScrollLocker {
  lockTarget: typeof uuid;

  options: scrollLockOptions;

  constructor(options?: scrollLockOptions) {
    // eslint-disable-next-line no-plusplus
    this.lockTarget = uuid++;
    this.options = options;
  }

  lock() {
    // If lockTarget exist return
    if (locks.some(({ target }) => target === this.lockTarget)) {
      return;
    }

    // If same container effect, return
    if (
      locks.some(
        ({ options }) => options?.container === this.options?.container,
      )
    ) {
      locks = [...locks, { target: this.lockTarget, options: this.options }];
      return;
    }

    // Add Effect
    const scrollBarSize = getScrollBarSize();
    const container = this.options?.container || document.body;
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
      { target: this.lockTarget, options: this.options, cacheStyle },
    ];
  }

  unLock() {
    const findLock = locks.find(({ target }) => target === this.lockTarget);

    locks = locks.filter(({ target }) => target !== this.lockTarget);

    if (
      !findLock ||
      locks.some(
        ({ options }) => options?.container === findLock.options?.container,
      )
    ) {
      return;
    }

    // Remove Effect
    const container = this.options?.container || document.body;
    const containerClassName = container.className;

    if (!scrollingEffectClassNameReg.test(containerClassName)) return;
    setStyle(
      // @ts-ignore position should be empty string
      findLock.cacheStyle || {
        position: '',
        width: '',
      },
      { element: container },
    );
    container.className = container.className
      .replace(scrollingEffectClassNameReg, '')
      .trim();
  }
}
