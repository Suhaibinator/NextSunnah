import React from 'react';
import { render, screen, fireEvent } from '@/test-utils';
import { SearchBar } from '@/components/search-bar';

describe('SearchBar component', () => {
  
  test('renders correctly with compact size', () => {
    render(<SearchBar size="compact" />);
    
    // Check if search input exists with compact placeholder
    const searchInput = screen.getByPlaceholderText('Search hadith...');
    expect(searchInput).toBeInTheDocument();
    
    // Check if search button exists with aria-label
    const searchButton = screen.getByLabelText('Search');
    expect(searchButton).toBeInTheDocument();
  });
  
  test('updates input value on change', () => {
    render(<SearchBar />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search ...');
    
    // Simulate typing in the search input
    fireEvent.change(searchInput, { target: { value: 'prayer' } });
    
    // Check if the input value was updated
    expect(searchInput).toHaveValue('prayer');
  });
  
  test('calls handleSubmit on form submission', () => {
    // Mock console.log to check if it's called
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<SearchBar />);
    
    // Get the search input and form
    const searchInput = screen.getByPlaceholderText('Search ...');
    const form = searchInput.closest('form');
    
    // Simulate typing and submitting the form
    fireEvent.change(searchInput, { target: { value: 'fasting' } });
    fireEvent.submit(form!);
    
    // Check if console.log was called with the search query
    expect(consoleSpy).toHaveBeenCalledWith('Search query:', 'fasting');
    
    // Restore the original console.log
    consoleSpy.mockRestore();
  });
});
