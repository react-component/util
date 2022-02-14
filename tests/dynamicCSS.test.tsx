/* eslint-disable no-eval */
import { injectCSS, updateCSS, removeCSS } from '../src/Dom/dynamicCSS';

const TEST_STYLE = '.bamboo { context: "light" }';

describe('dynamicCSS', () => {
  describe('injectCSS', () => {
    beforeEach(() => {
      expect(document.querySelectorAll('style')).toHaveLength(0);
    });

    afterEach(() => {
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        style.parentNode.removeChild(style);
      });
    });

    it('basic', () => {
      const style = injectCSS(TEST_STYLE);
      expect(document.querySelector('style').contains(style));
      expect(document.querySelector('style').innerHTML).toEqual(TEST_STYLE);
    });

    it('with CSP', () => {
      const style = injectCSS(TEST_STYLE, { csp: { nonce: 'light' } });
      expect(document.contains(style));
      expect(document.querySelector('style').innerHTML).toEqual(TEST_STYLE);
      expect(document.querySelector('style').nonce).toEqual('light');
    });

    describe('prepend', () => {
      function testPrepend() {
        const head = document.querySelector('head');
        head.append(document.createElement('script'));

        const style = injectCSS(TEST_STYLE, { prepend: true });

        expect(head.firstElementChild).toBe(style);
        expect(document.contains(style));
        expect(document.querySelector('style').innerHTML).toEqual(TEST_STYLE);
      }

      it('basic', () => {
        testPrepend();
      });

      it('prepend with IE', () => {
        const head = document.querySelector('head');
        const originPrepend = head.prepend;
        head.prepend = null;

        testPrepend();

        head.prepend = originPrepend;
      });
    });
  });

  it('remove should work', () => {
    // Update
    const style = updateCSS(TEST_STYLE, 'remove-test');
    expect(document.querySelector('style')).toBeTruthy();
    expect(document.querySelector('style').contains(style));

    // Remove
    removeCSS('remove-test');
    expect(document.querySelector('style')).toBeFalsy();
  });

  describe('updateCSS', () => {
    beforeEach(() => {
      updateCSS(TEST_STYLE, 'unique');
    });

    afterEach(() => {
      const styles = document.querySelectorAll('style');
      Array.from(styles).forEach(style => {
        style.parentNode.removeChild(style);
      });
    });

    it('replace', () => {
      const REPLACE_STYLE = '.light { context: "bamboo" }';
      updateCSS(REPLACE_STYLE, 'unique');

      expect(document.querySelectorAll('style')).toHaveLength(1);
      expect(document.querySelector('style').innerHTML).toEqual(REPLACE_STYLE);
    });

    it('replace with CSP', () => {
      const REPLACE_STYLE = '.bamboo { context: "little" }';
      updateCSS(REPLACE_STYLE, 'unique', { csp: { nonce: 'only' } });

      expect(document.querySelectorAll('style')).toHaveLength(1);
      expect(document.querySelector('style').innerHTML).toEqual(REPLACE_STYLE);
      expect(document.querySelector('style').nonce).toEqual('only');
    });

    it('customize mark', () => {
      // Clean up
      removeCSS('unique');

      const ORIGIN_STYLE = '.light { context: "little" }';
      updateCSS(ORIGIN_STYLE, 'marked', { mark: 'light' });

      expect(document.querySelectorAll('style')).toHaveLength(1);
      expect(document.querySelector('style').innerHTML).toEqual(ORIGIN_STYLE);

      const REPLACE_STYLE = '.light { context: "bamboo" }';
      updateCSS(REPLACE_STYLE, 'marked', { mark: 'light' });

      expect(document.querySelectorAll('style')).toHaveLength(1);
      expect(document.querySelector('style').innerHTML).toEqual(REPLACE_STYLE);
    });
  });
});
