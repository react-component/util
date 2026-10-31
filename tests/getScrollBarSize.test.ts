import getScrollBarSize, {
  getTargetScrollBarSize,
} from '../src/getScrollBarSize';
import { spyElementPrototypes } from '../src/test/domHook';
import { clearContainerCache } from '../src/Dom/dynamicCSS';

const DEFAULT_SIZE = 16;

describe('getScrollBarSize', () => {
  let defaultSize = DEFAULT_SIZE;

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      offsetWidth: {
        get: () => {
          return 100;
        },
      },
      clientWidth: {
        get: () => {
          return 100 - defaultSize;
        },
      },
    });
  });

  beforeEach(() => {
    defaultSize = DEFAULT_SIZE;
  });

  it('basicSize', () => {
    expect(getScrollBarSize()).toEqual(16);
  });

  it('fresh it', () => {
    expect(getScrollBarSize(true)).toEqual(16);

    defaultSize = 33;
    expect(getScrollBarSize(true)).toEqual(33);
  });

  describe('getTargetScrollBarSize', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      clearContainerCache();
    });

    it.each([undefined, {}, { nonce: 'test-nonce' }])(
      'measures and cleans up with CSP config %p',
      csp => {
        const target = document.createElement('div');
        jest.spyOn(window, 'getComputedStyle').mockImplementation(
          (_, pseudoElement) =>
            ({
              width: pseudoElement ? '12px' : '100px',
              height: pseudoElement ? '8px' : '100px',
              scrollbarColor: 'auto',
              scrollbarWidth: 'auto',
            }) as CSSStyleDeclaration,
        );

        const insertedStyles: HTMLStyleElement[] = [];
        const appendChild = document.head.appendChild;
        jest.spyOn(document.head, 'appendChild').mockImplementation(node => {
          if (node instanceof HTMLStyleElement) {
            // CSP checks the nonce at insertion, including the placeholder style.
            expect(node.nonce).toBe(csp?.nonce || '');
            insertedStyles.push(node);
          }
          return appendChild.call(document.head, node) as typeof node;
        });

        expect(getTargetScrollBarSize(target, csp)).toEqual({
          width: DEFAULT_SIZE,
          height: 0,
        });
        expect(insertedStyles).toHaveLength(2);
        expect(insertedStyles[1].innerHTML).toContain('width: 12px;');
        expect(insertedStyles[1].innerHTML).toContain('height: 8px;');
        insertedStyles.forEach(style => {
          expect(style.parentNode).toBeNull();
        });
        expect(
          document.querySelector('[id^="rc-scrollbar-measure-"]'),
        ).toBeNull();
      },
    );

    it('invalidate', () => {
      expect(
        getTargetScrollBarSize({ notValidateObject: true } as any),
      ).toEqual({
        width: 0,
        height: 0,
      });
    });
  });
});
