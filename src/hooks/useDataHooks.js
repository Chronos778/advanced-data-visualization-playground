import { useState, useCallback, useMemo } from 'react';
import { validateData as validateDataUtil } from '../utils/dataUtils';

/**
 * Custom hook for data validation
 * @param {Object} data - Data to validate
 * @returns {Object} Validation state and methods
 */
export const useDataValidation = (data) => {
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);

  const validate = useCallback(() => {
    const result = validateDataUtil(data);
    setValidationErrors(result.errors);
    setValidationWarnings(result.warnings);
    return result.valid;
  }, [data]);

  const isValid = useMemo(() => {
    if (!data) return false;
    return validationErrors.length === 0;
  }, [data, validationErrors]);

  return {
    validate,
    isValid,
    errors: validationErrors,
    warnings: validationWarnings,
    hasWarnings: validationWarnings.length > 0
  };
};

/**
 * Custom hook for chart configuration
 * @param {Object} initialConfig - Initial chart configuration
 * @returns {Object} Chart configuration state and methods
 */
export const useChartConfiguration = (initialConfig = {}) => {
  const [config, setConfig] = useState({
    animated: true,
    showLegend: true,
    showTooltip: true,
    maintainAspectRatio: false,
    responsive: true,
    ...initialConfig
  });

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  return {
    config,
    updateConfig,
    resetConfig,
    setConfig
  };
};

/**
 * Custom hook for local storage
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Return initial value if localStorage fails
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Silently fail if localStorage is not available
      setStoredValue(value instanceof Function ? value(storedValue) : value);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      // Silently reset to initial value if localStorage fails
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Custom hook for debounced value
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for window dimensions
 * @returns {Object} Window dimensions
 */
export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useState(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};

/**
 * Custom hook for previous value
 * @param {*} value - Current value
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(null);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
};
