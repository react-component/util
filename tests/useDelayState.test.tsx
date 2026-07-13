import { act, renderHook } from '@testing-library/react';
import useDelayState from '../src/hooks/useDelayState';

describe('useDelayState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('updates on the next frame by default', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1);
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      jest.advanceTimersByTime(16);
    });
    expect(result.current[0]).toBe(1);
  });

  it('updates immediately', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1, true);
    });
    expect(result.current[0]).toBe(1);
  });

  it('delays when immediate is false', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1, false);
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      jest.advanceTimersByTime(16);
    });
    expect(result.current[0]).toBe(1);
  });

  it('supports frame delay', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1, { frame: 2 });
      jest.advanceTimersByTime(16);
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      jest.advanceTimersByTime(16);
    });
    expect(result.current[0]).toBe(1);
  });

  it('supports millisecond delay', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1, { ms: 100 });
      jest.advanceTimersByTime(99);
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current[0]).toBe(1);
  });

  it('uses the latest pending update', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1, { ms: 100 });
      result.current[1](2);
      jest.advanceTimersByTime(16);
    });
    expect(result.current[0]).toBe(2);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current[0]).toBe(2);

    act(() => {
      result.current[1](3, { frame: 2 });
      result.current[1](4, { ms: 100 });
      jest.advanceTimersByTime(32);
    });
    expect(result.current[0]).toBe(2);

    act(() => {
      jest.advanceTimersByTime(68);
    });
    expect(result.current[0]).toBe(4);
  });

  it('cancels a pending update when updating immediately', () => {
    const { result } = renderHook(() => useDelayState(0));

    act(() => {
      result.current[1](1, { frame: 2 });
      result.current[1](2, true);
    });
    expect(result.current[0]).toBe(2);

    act(() => {
      jest.advanceTimersByTime(32);
    });
    expect(result.current[0]).toBe(2);
  });

  it('supports updater function', () => {
    const { result } = renderHook(() => useDelayState(1));

    act(() => {
      result.current[1](value => value + 1);
      jest.advanceTimersByTime(16);
    });
    expect(result.current[0]).toBe(2);
  });
});
