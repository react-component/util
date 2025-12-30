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
    const div = document.createElement('div');
    const result1 = testIsEditableTarget(window, window);
    const result2 = testIsEditableTarget(div, div);

    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });

  it('IME composing', () => {
    const input = document.createElement('input');
    const result = testIsEditableTarget(input, input, { isComposing: true });

    expect(result).toBe(true);
  });

  it('check editable target', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    const editable = document.createElement('div');
    // mock isContentEditable cause JSDOM don't support it
    Object.defineProperty(editable, 'isContentEditable', { value: true });

    const result1 = testIsEditableTarget(window, input, { bubbles: true });
    const result2 = testIsEditableTarget(editable, editable);

    document.body.removeChild(input);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });
});
