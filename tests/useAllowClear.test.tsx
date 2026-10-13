import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { useAllowClear } from '../src';
import type { AllowClearConfig } from '../src';

describe('useAllowClear', () => {
  it.each<[boolean | AllowClearConfig | undefined, AllowClearConfig]>([
    [undefined, { disabled: true }],
    [false, { disabled: true }],
    [true, { disabled: false }],
    [{}, { disabled: false }],
    [{ disabled: undefined }, { disabled: false }],
    [{ disabled: false }, { disabled: false }],
    [{ disabled: true }, { disabled: true }],
    [{ clearIcon: null }, { clearIcon: null, disabled: false }],
    [{ tabIndex: -1 }, { tabIndex: -1, disabled: false }],
    [{ tabIndex: 0 }, { tabIndex: 0, disabled: false }],
    [{ label: '' }, { label: '', disabled: false }],
    [
      { label: 'Clear selection' },
      { label: 'Clear selection', disabled: false },
    ],
  ])('normalizes %p to %p', (allowClear, expected) => {
    const { result } = renderHook(() => useAllowClear(allowClear));
    expect(result.current).toEqual(expected);
  });

  it('disables clearing when called without an argument', () => {
    const { result } = renderHook(() => useAllowClear());
    expect(result.current).toEqual({ disabled: true });
  });

  it('preserves all fields without mutating the input during toggles', () => {
    const clearIcon = <span>Clear</span>;
    const config: AllowClearConfig = Object.freeze({
      clearIcon,
      tabIndex: 0,
      label: 'Clear selection',
    });
    const disabledConfig = Object.freeze({ ...config, disabled: true });
    const { result, rerender } = renderHook(
      (allowClear: boolean | AllowClearConfig) => useAllowClear(allowClear),
      { initialProps: config },
    );

    expect(result.current).toEqual({ ...config, disabled: false });
    expect(result.current).not.toBe(config);
    expect(result.current.clearIcon).toBe(clearIcon);
    expect(config).not.toHaveProperty('disabled');

    rerender(disabledConfig);
    expect(result.current).toEqual(disabledConfig);
    expect(result.current.clearIcon).toBe(clearIcon);

    rerender(false);
    expect(result.current).toEqual({ disabled: true });

    rerender(config);
    expect(result.current).toEqual({ ...config, disabled: false });
    expect(result.current.clearIcon).toBe(clearIcon);
    expect(config).not.toHaveProperty('disabled');
    expect(disabledConfig.disabled).toBe(true);
  });

  it.each([undefined, false, true, {}])(
    'keeps the result stable for unchanged input %p',
    allowClear => {
      const { result, rerender } = renderHook(() => useAllowClear(allowClear));
      const previous = result.current;
      rerender();
      expect(result.current).toBe(previous);
    },
  );

  it('updates when the configuration changes', () => {
    const { result, rerender } = renderHook(
      (allowClear: AllowClearConfig) => useAllowClear(allowClear),
      { initialProps: { clearIcon: 'Old', tabIndex: -1, label: 'Clear' } },
    );
    const previous = result.current;
    const config = {
      clearIcon: 'New',
      disabled: false,
      tabIndex: 0,
      label: 'Clear selection',
    };

    rerender(config);
    expect(result.current).not.toBe(previous);
    expect(result.current).toEqual(config);
  });
});
