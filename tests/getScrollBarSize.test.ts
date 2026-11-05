import getScrollBarSize, {
  getTargetScrollBarSize,
} from '../src/getScrollBarSize';
import { spyElementPrototypes } from '../src/test/domHook';
import * as dynamicCSS from '../src/Dom/dynamicCSS';

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
  });

  describe('nonce support', () => {
    let updateCSSSpy: jest.SpyInstance;

    beforeEach(() => {
      updateCSSSpy = jest.spyOn(dynamicCSS, 'updateCSS');
    });

    afterEach(() => {
      updateCSSSpy.mockRestore();
    });

    it('should pass nonce to updateCSS when provided in getScrollBarSize', () => {
      const testNonce = 'test-nonce-123';

      // We need to test with getTargetScrollBarSize since getScrollBarSize
      // without an element doesn't trigger updateCSS
      const mockElement = document.createElement('div');
      document.body.appendChild(mockElement);

      // Mock getComputedStyle to return webkit scrollbar dimensions
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = jest
        .fn()
        .mockImplementation((element, pseudoElement) => {
          if (pseudoElement === '::-webkit-scrollbar') {
            return {
              width: '10px',
              height: '10px',
            };
          }
          return {
            scrollbarColor: '',
            scrollbarWidth: '',
            overflow: 'scroll',
          };
        }) as any;

      // This will trigger updateCSS with webkit styles
      getTargetScrollBarSize(mockElement, testNonce);

      // Restore original
      window.getComputedStyle = originalGetComputedStyle;
      document.body.removeChild(mockElement);

      // Check if updateCSS was called with nonce
      const updateCSSCalls = updateCSSSpy.mock.calls;
      const callWithNonce = updateCSSCalls.find(
        call => call[2]?.csp?.nonce === testNonce,
      );

      expect(callWithNonce).toBeDefined();
    });

    it('should pass nonce to updateCSS when provided in getTargetScrollBarSize', () => {
      const testNonce = 'target-nonce-456';
      const mockElement = document.createElement('div');
      document.body.appendChild(mockElement);

      // Mock getComputedStyle to return webkit scrollbar dimensions
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = jest
        .fn()
        .mockImplementation((element, pseudoElement) => {
          if (pseudoElement === '::-webkit-scrollbar') {
            return {
              width: '12px',
              height: '12px',
            };
          }
          return {
            scrollbarColor: '',
            scrollbarWidth: '',
            overflow: 'scroll',
          };
        }) as any;

      getTargetScrollBarSize(mockElement, testNonce);

      // Restore original
      window.getComputedStyle = originalGetComputedStyle;
      document.body.removeChild(mockElement);

      // Check if updateCSS was called with nonce
      const updateCSSCalls = updateCSSSpy.mock.calls;
      const callWithNonce = updateCSSCalls.find(
        call => call[2]?.csp?.nonce === testNonce,
      );

      expect(callWithNonce).toBeDefined();
    });

    it('should not pass nonce to updateCSS when not provided', () => {
      const mockElement = document.createElement('div');
      document.body.appendChild(mockElement);

      // Mock getComputedStyle to return webkit scrollbar dimensions
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = jest
        .fn()
        .mockImplementation((element, pseudoElement) => {
          if (pseudoElement === '::-webkit-scrollbar') {
            return {
              width: '8px',
              height: '8px',
            };
          }
          return {
            scrollbarColor: '',
            scrollbarWidth: '',
            overflow: 'scroll',
          };
        }) as any;

      // Clear previous calls
      updateCSSSpy.mockClear();

      // Call without nonce
      getTargetScrollBarSize(mockElement);

      // Restore original
      window.getComputedStyle = originalGetComputedStyle;
      document.body.removeChild(mockElement);

      // Check if updateCSS was called without nonce (undefined as third parameter)
      const updateCSSCalls = updateCSSSpy.mock.calls;
      if (updateCSSCalls.length > 0) {
        const lastCall = updateCSSCalls[updateCSSCalls.length - 1];
        expect(lastCall[2]).toBeUndefined();
      }
    });
  });
});
