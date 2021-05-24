import { spyElementPrototypes } from '../src/test/domHook';
import getScrollBarSize, {
  getTargetScrollBarSize,
} from '../src/getScrollBarSize';

const DEFAULT_SIZE = 16;

describe('getScrollBarSize', () => {
  let defaultSize = DEFAULT_SIZE;

  beforeAll(() => {
    let i = 0;

    spyElementPrototypes(HTMLElement, {
      offsetWidth: {
        get: () => {
          i += 1;
          return i % 2 ? 100 : 100 - defaultSize;
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
    it('validate', () => {
      const getSpy = jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            width: '23px',
            height: '93px',
          } as any),
      );

      expect(getTargetScrollBarSize(document.createElement('div'))).toEqual({
        width: 23,
        height: 93,
      });

      getSpy.mockRestore();
    });

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
