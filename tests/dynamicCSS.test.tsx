/* eslint-disable no-eval */
import {
  clearContainerCache,
  injectCSS,
  removeCSS,
  updateCSS,
} from '../src/Dom/dynamicCSS';

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

      it('prepend with queue', () => {
        const head = document.querySelector('head');

        const styles = [
          injectCSS(TEST_STYLE, { prepend: 'queue' }),
          injectCSS(TEST_STYLE, { prepend: 'queue' }),
        ];

        const styleNodes = Array.from(head.querySelectorAll('style'));
        expect(styleNodes).toHaveLength(2);

        for (let i = 0; i < styleNodes.length; i += 1) {
          expect(styles[i]).toBe(styleNodes[i]);
        }

        // Should not after append
        const appendStyle = injectCSS(TEST_STYLE);
        const prependStyle = injectCSS(TEST_STYLE, { prepend: 'queue' });
        const nextStyleNodes = Array.from(head.querySelectorAll('style'));

        expect(nextStyleNodes).toHaveLength(4);
        expect(nextStyleNodes[0]).toBe(styles[0]);
        expect(nextStyleNodes[1]).toBe(styles[1]);
        expect(nextStyleNodes[2]).toBe(prependStyle);
        expect(nextStyleNodes[3]).toBe(appendStyle);
      });

      it('prepend with queue and priority', () => {
        const style2 = injectCSS(TEST_STYLE, { prepend: 'queue', priority: 2 });
        const style1 = injectCSS(TEST_STYLE, { prepend: 'queue', priority: 1 });
        const style0 = injectCSS(TEST_STYLE, { prepend: 'queue', priority: 0 });
        const style = injectCSS(TEST_STYLE, { prepend: 'queue' });
        const stylePrepend = injectCSS(TEST_STYLE, { prepend: true });

        const head = document.querySelector('head');
        const styleNodes = Array.from(head.querySelectorAll('style'));
        expect(styleNodes).toHaveLength(5);

        const styles = [stylePrepend, style0, style, style1, style2];

        for (let i = 0; i < styleNodes.length; i += 1) {
          expect(styles[i]).toBe(styleNodes[i]);
        }
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

    describe('customize mark', () => {
      beforeEach(() => {
        // Clean up
        removeCSS('unique');
      });

      const ORIGIN_STYLE = '.light { context: "little" }';
      const REPLACE_STYLE = '.light { context: "bamboo" }';

      it('basic', () => {
        updateCSS(ORIGIN_STYLE, 'marked', { mark: 'light' });

        expect(document.querySelectorAll('style')).toHaveLength(1);
        expect(document.querySelector('style').innerHTML).toEqual(ORIGIN_STYLE);

        updateCSS(REPLACE_STYLE, 'marked', { mark: 'light' });

        expect(document.querySelectorAll('style')).toHaveLength(1);
        expect(document.querySelector('style').innerHTML).toEqual(
          REPLACE_STYLE,
        );
        expect(
          document.querySelector('style').getAttribute('data-light'),
        ).toBeTruthy();
      });

      it('start with data-', () => {
        updateCSS(ORIGIN_STYLE, 'marked', { mark: 'data-good' });

        expect(document.querySelectorAll('style')).toHaveLength(1);
        expect(document.querySelector('style').innerHTML).toEqual(ORIGIN_STYLE);

        updateCSS(REPLACE_STYLE, 'marked', { mark: 'data-good' });

        expect(document.querySelectorAll('style')).toHaveLength(1);
        expect(document.querySelector('style').innerHTML).toEqual(
          REPLACE_STYLE,
        );
        expect(
          document.querySelector('style').getAttribute('data-good'),
        ).toBeTruthy();
      });
    });
  });

  describe('qiankun', () => {
    let originAppendChild: typeof document.head.appendChild;
    let originRemoveChild: typeof document.head.removeChild;
    let targetContainer: HTMLElement;

    beforeAll(() => {
      clearContainerCache();
      originAppendChild = document.head.appendChild;
      originRemoveChild = document.head.removeChild;
      document.head.appendChild = ele => targetContainer.appendChild(ele);
      document.head.removeChild = ele => targetContainer.removeChild(ele);
    });

    afterAll(() => {
      document.head.appendChild = originAppendChild;
      document.head.removeChild = originRemoveChild;
    });

    it('updateCSS', () => {
      targetContainer = document.createElement('div');
      document.body.appendChild(targetContainer);

      // First insert
      const firstStyle = updateCSS('body { color: red; }', 'qiankun');
      expect(document.head.contains(firstStyle)).toBeFalsy();
      expect(targetContainer.contains(firstStyle)).toBeTruthy();

      // Mock qiankun uninstall
      removeCSS('qiankun');
      expect(document.head.contains(firstStyle)).toBeFalsy();
      expect(targetContainer.contains(firstStyle)).toBeFalsy();

      // Mock qiankun reinstall
      document.body.removeChild(targetContainer);
      targetContainer = document.createElement('div');
      document.body.appendChild(targetContainer);

      // Second insert
      const SecondStyle = updateCSS('body { color: red; }', 'qiankun');
      expect(document.head.contains(SecondStyle)).toBeFalsy();
      expect(targetContainer.contains(SecondStyle)).toBeTruthy();
    });
  });
});
