/**
 * Unit tests for DataContext
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DataProvider, useDataContext } from './DataContext';

// Test component that uses the context
const TestComponent = () => {
  const { 
    data, 
    loadData,
    transformedData,
    notifications 
  } = useDataContext();
  
  return (
    <div>
      <div data-testid="data-exists">{data ? 'yes' : 'no'}</div>
      <div data-testid="transformed-exists">{transformedData ? 'yes' : 'no'}</div>
      <div data-testid="notification-count">{notifications.length}</div>
      <button onClick={() => loadData({ data: [{ id: 1 }], columns: ['id'], fileName: 'test.csv', rowCount: 1 })}>
        Set Data
      </button>
    </div>
  );
};

describe('DataContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides initial context values', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    expect(screen.getByTestId('data-exists')).toHaveTextContent('no');
    expect(screen.getByTestId('transformed-exists')).toHaveTextContent('no');
  });

  test('updates data when setData is called', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    const setDataButton = screen.getByText('Set Data');
    
    act(() => {
      setDataButton.click();
    });
    
    expect(screen.getByTestId('data-exists')).toHaveTextContent('yes');
  });

  test('throws error when useDataContext is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDataContext must be used within a DataProvider');
    
    console.error = originalError;
  });
});
