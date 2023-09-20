import { getShadowRoot } from '../src/Dom/shadow';

describe('shadow', () => {
  describe('getShadowRoot', () => {
    it('show work', () => {
      const shadowRoot = document.createElement('div');
      document.body.appendChild(shadowRoot);

      const shadow = shadowRoot.attachShadow({ mode: 'open' });
      const inShadowButton = document.createElement('button');
      shadow.appendChild(inShadowButton);

      expect(getShadowRoot(inShadowButton)).toBe(shadow);
    });

    it('show return null', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);

      expect(getShadowRoot(button)).toBeNull();
    });

    it('should return null if dom is not appended', () => {
      const button = document.createElement('button');
      expect(getShadowRoot(button)).toBeNull();
    });
  });
});
