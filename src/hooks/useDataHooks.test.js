/**
 * Unit tests for useDataHooks.js
 */

import { renderHook, act } from '@testing-library/react';
import {
  useLocalStorage,
  useDebounce,
  useWindowDimensions,
  usePrevious
} from './useDataHooks';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initializes with default value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey', 'defaultValue')
    );
    
    expect(result.current[0]).toBe('defaultValue');
  });

  test('stores and retrieves value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey', '')
    );
    
    act(() => {
      result.current[1]('newValue');
    });
    
    expect(result.current[0]).toBe('newValue');
  });

  test('removes value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey', 'initialValue')
    );
    
    act(() => {
      result.current[1]('storedValue');
    });
    
    act(() => {
      result.current[2](); // removeValue
    });
    
    expect(result.current[0]).toBe('initialValue');
  });
});

describe('useDebounce', () => {
  test('returns initial value', () => {
    const { result } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );
    
    expect(result.current).toBe('initial');
  });
});

describe('useWindowDimensions', () => {
  test('returns current window dimensions', () => {
    const { result } = renderHook(() => useWindowDimensions());
    
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });
});

describe('usePrevious', () => {
  test('returns previous value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'first' } }
    );
    
    // First render returns null or undefined
    expect(result.current == null).toBe(true);
    
    rerender({ value: 'second' });
    expect(result.current).toBe('first');
  });
});
