/**
 * Unit tests for dataUtils.js
 */

import {
  isNumeric,
  getNumericColumns,
  formatNumber,
  calculateStats,
  validateData,
  exportToCSV,
  downloadJSON
} from './dataUtils';

describe('dataUtils - Type Checking', () => {
  test('isNumeric identifies numeric values correctly', () => {
    expect(isNumeric(123)).toBe(true);
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('123.45')).toBe(true);
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
    expect(isNumeric('')).toBe(false);
  });

  test('getNumericColumns returns only numeric column names', () => {
    const data = [
      { name: 'John', age: 30, salary: 50000 },
      { name: 'Jane', age: 25, salary: 60000 }
    ];
    const columns = ['name', 'age', 'salary'];
    const result = getNumericColumns(data, columns);
    expect(result).toContain('age');
    expect(result).toContain('salary');
    expect(result).not.toContain('name');
  });
});

describe('dataUtils - Formatting', () => {
  test('formatNumber formats numbers correctly', () => {
    const result1 = formatNumber(1234.567);
    expect(result1).toContain('1');
    expect(result1).toContain('234');
    expect(result1).toContain('57');
    
    const result2 = formatNumber(1000000);
    expect(result2).toContain('1');
    expect(result2).toContain('000');
  });
});

describe('dataUtils - Statistics', () => {
  test('calculateStats computes correct statistics', () => {
    const values = [10, 20, 30, 40, 50];
    
    const stats = calculateStats(values);
    
    expect(stats.count).toBe(5);
    expect(stats.sum).toBe(150);
    expect(stats.mean).toBe(30);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(50);
    expect(stats.median).toBe(30);
  });

  test('calculateStats handles empty data', () => {
    const stats = calculateStats([]);
    expect(stats.count).toBe(0);
    expect(stats.min).toBe(null);
  });
});

describe('dataUtils - Validation', () => {
  test('validateData validates data structure correctly', () => {
    const validData = {
      data: [{ id: 1 }, { id: 2 }],
      columns: ['id']
    };
    const result = validateData(validData);
    expect(result.valid).toBe(true);

    const invalidData1 = { data: null };
    expect(validateData(invalidData1).valid).toBe(false);

    const invalidData2 = { data: 'not an array' };
    expect(validateData(invalidData2).valid).toBe(false);

    const invalidData3 = { data: [] };
    expect(validateData(invalidData3).valid).toBe(false);
  });
});

// Skip export tests - they require DOM APIs not available in test environment
