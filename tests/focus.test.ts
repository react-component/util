/* eslint-disable class-methods-use-this */
import { spyElementPrototype } from '../src/test/domHook';
import { getFocusNodeList, triggerFocus } from '../src/Dom/focus';

describe('focus', () => {
  beforeAll(() => {
    spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => document.body,
    });
  });

  it('getFocusNodeList', () => {
    const div = document.createElement('div');
    div.setAttribute('tabIndex', '0');
    document.body.appendChild(div);

    div.innerHTML = [
      '<input disabled />',
      '<button></button>',
      '<textarea tabindex="-1"></textarea>',
      '<a>noop</a>',
      '<a href="light">go</a>',
      '<div contenteditable="true"></div>',
    ].join('');

    (div.lastChild as any).isContentEditable = true;

    const focusList = getFocusNodeList(div);
    expect(focusList).toHaveLength(4);

    const tabFocusList = getFocusNodeList(div, true);
    expect(tabFocusList).toHaveLength(5);
  });

  it('triggerFocus should set cursor position for textarea', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'test content';

    const focusSpy = jest.spyOn(textarea, 'focus');
    const setSelectionRangeSpy = jest.spyOn(textarea, 'setSelectionRange');

    // Test cursor: 'start'
    triggerFocus(textarea, { cursor: 'start' });
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(0, 0);

    // Test cursor: 'end'
    triggerFocus(textarea, { cursor: 'end' });
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(12, 12); // 'test content'.length = 12

    // Test cursor: 'all'
    triggerFocus(textarea, { cursor: 'all' });
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(0, 12); // select all text

    expect(focusSpy).toHaveBeenCalledTimes(3);

    focusSpy.mockRestore();
    setSelectionRangeSpy.mockRestore();
  });
});
