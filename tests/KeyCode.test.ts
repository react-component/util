import KeyCode from '../src/KeyCode';

describe('KeyCode.isEditableTarget', () => {
  function testIsEditableTarget(
    listenTarget: EventTarget,
    dispatchTarget: EventTarget,
    init?: KeyboardEventInit,
  ) {
    let result: boolean | undefined;

    const handler = (e: KeyboardEvent) => {
      result = KeyCode.isEditableTarget(e);
    };

    listenTarget.addEventListener('keydown', handler);
    dispatchTarget.dispatchEvent(new KeyboardEvent('keydown', init));
    listenTarget.removeEventListener('keydown', handler);

    return result;
  }

  it('check non-editable target', () => {
    const result = testIsEditableTarget(window, window);

    expect(result).toBe(false);
  });

  it('IME composing', () => {
    const input = document.createElement('input');
    const result = testIsEditableTarget(input, input, { isComposing: true });

    expect(result).toBe(true);
  });

  it('check input target', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    const result = testIsEditableTarget(window, input, { bubbles: true });

    document.body.removeChild(input);

    expect(result).toBe(true);
  });

  it('check contentEditable target', () => {
    const editable = document.createElement('div');
    // mock isContentEditable cause JSDOM don't support it
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    const result = testIsEditableTarget(editable, editable);

    expect(result).toBe(true);
  });
});
