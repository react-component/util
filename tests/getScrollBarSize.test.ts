import getScrollBarSize, {
  getTargetScrollBarSize,
} from '../src/getScrollBarSize';
import { spyElementPrototypes } from '../src/test/domHook';

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
    it('invalidate', () => {
      expect(
        getTargetScrollBarSize({ notValidateObject: true } as any),
      ).toEqual({
        width: 0,
        height: 0,
      });
    });

    it('should pass csp nonce to updateCSS', () => {
      const updateCSSSpy = jest.spyOn(
        require('../src/Dom/dynamicCSS'),
        'updateCSS',
      );

      const target = document.createElement('div');
      document.body.appendChild(target);

      const nonce = 'test-nonce-123';
      getTargetScrollBarSize(target, { nonce });

      expect(updateCSSSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        { csp: { nonce } },
      );

      updateCSSSpy.mockRestore();
      document.body.removeChild(target);
    });
  });
});
