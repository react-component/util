import proxyObject from '../src/proxyObject';

describe('proxyObject', () => {
  it('work', () => {
    const div = document.createElement('div');
    div.innerHTML = '<a>noop</a>';
    const a = div.firstChild as HTMLAnchorElement;

    const proxyA = proxyObject(a, {
      bamboo: 'little',
    });

    expect(proxyA.bamboo).toBe('little');
  });

  it('null', () => {
    const proxyA = proxyObject(null, {
      bamboo: 'little',
    });

    expect(proxyA).toBe(null);
  });

  it('uses the native element as the receiver for property setters', () => {
    const input = document.createElement('input');
    const valueDescriptor = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    );

    Object.defineProperty(input, 'value', {
      configurable: true,
      get() {
        return valueDescriptor.get.call(this);
      },
      set(value: string) {
        if (this !== input) {
          throw new TypeError('Illegal invocation');
        }
        valueDescriptor.set.call(input, value);
      },
    });

    const proxyInput = proxyObject(input, {});

    expect(() => {
      proxyInput.value = '321';
    }).not.toThrow();
    expect(input.value).toBe('321');
  });

  it('preserves writes to ordinary properties', () => {
    const div = document.createElement('div');
    const proxyDiv = proxyObject(div, {});

    expect(() => {
      proxyDiv.id = 'updated';
    }).not.toThrow();
    expect(div.id).toBe('updated');
  });
});
