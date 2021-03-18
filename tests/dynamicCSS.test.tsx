/* eslint-disable no-eval */
import { injectCSS, updateCSS } from '../src/Dom/dynamicCSS';

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
      expect(document.body.contains(style));
      expect(document.body.querySelector('style').innerHTML).toEqual(
        TEST_STYLE,
      );
    });

    it('with CSP', () => {
      const style = injectCSS(TEST_STYLE, { csp: 'light' });
      expect(document.body.contains(style));
      expect(document.body.querySelector('style').innerHTML).toEqual(
        TEST_STYLE,
      );
      expect(document.body.querySelector('style').nonce).toEqual('light');
    });
  });

  describe('updateCSS', () => {
    beforeAll(() => {
      updateCSS(TEST_STYLE, 'unique');
    });

    afterAll(() => {
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        style.parentNode.removeChild(style);
      });
    });

    it('replace', () => {
      const REPLACE_STYLE = '.light { context: "bamboo" }';
      updateCSS(REPLACE_STYLE, 'unique');

      expect(document.querySelectorAll('style')).toHaveLength(1);
      expect(document.body.querySelector('style').innerHTML).toEqual(
        REPLACE_STYLE,
      );
    });

    it('replace with CSP', () => {
      const REPLACE_STYLE = '.bamboo { context: "little" }';
      updateCSS(REPLACE_STYLE, 'unique', { csp: 'only' });

      expect(document.querySelectorAll('style')).toHaveLength(1);
      expect(document.body.querySelector('style').innerHTML).toEqual(
        REPLACE_STYLE,
      );
      expect(document.body.querySelector('style').nonce).toEqual('only');
    });
  });
});
