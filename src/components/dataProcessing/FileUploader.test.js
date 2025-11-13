/**
 * Unit tests for FileUploader component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import FileUploader from './FileUploader';

describe('FileUploader', () => {
  const mockOnDataLoaded = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders upload button', () => {
    render(
      <FileUploader 
        onDataLoaded={mockOnDataLoaded}
        onError={mockOnError}
      />
    );
    
    expect(screen.getByText('Choose Files')).toBeInTheDocument();
  });

  test('displays supported file formats', () => {
    render(
      <FileUploader 
        onDataLoaded={mockOnDataLoaded}
        onError={mockOnError}
      />
    );
    
    // Check that file format chips are rendered
    const csvChip = screen.getByText(/CSV/i);
    expect(csvChip).toBeInTheDocument();
  });
});
