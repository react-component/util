import isVisible from '../src/Dom/isVisible';

describe('isVisible', () => {
  it('supports DOM nodes from iframe', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    try {
      const iframeWindow = iframe.contentWindow!;
      const iframeDocument = iframeWindow.document;
      const div = iframeDocument.createElement('div');
      iframeDocument.body.appendChild(div);

      jest.spyOn(div, 'getBoundingClientRect').mockReturnValue({
        bottom: 10,
        height: 10,
        left: 0,
        right: 10,
        toJSON: () => {},
        top: 0,
        width: 10,
        x: 0,
        y: 0,
      });

      expect(div).toBeInstanceOf(iframeWindow.HTMLElement);
      expect(div).not.toBeInstanceOf(Element);
      expect(isVisible(div)).toBe(true);
    } finally {
      document.body.removeChild(iframe);
    }
  });
});
