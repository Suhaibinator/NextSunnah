import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
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
    
    // Check if console.log was called with the search query and selected collections
    expect(consoleSpy).toHaveBeenCalledWith('Search query:', 'fasting', 'Selected collections:', []);
    
    // Restore the original console.log
    consoleSpy.mockRestore();
  });

  test('opens tips popover when Tips button is clicked', async () => {
    render(<SearchBar />);
    
    // Find the Tips button by its aria-label
    const tipsButton = screen.getByLabelText('Search Tips');
    expect(tipsButton).toBeInTheDocument();
    
    // Click the Tips button to open the popover
    fireEvent.click(tipsButton);
    
    // Wait for the popover content to appear
    await waitFor(() => {
      // Check if the popover content is visible
      expect(screen.getByText('Search Tips')).toBeInTheDocument();
      
      // Check if the popover contains the expected content
      expect(screen.getByText('Quotes e.g. "pledge allegiance"')).toBeInTheDocument();
      expect(screen.getByText('Wildcards e.g. test*')).toBeInTheDocument();
      expect(screen.getByText('Fuzzy Search e.g. swore~')).toBeInTheDocument();
      expect(screen.getByText('Term Boosting e.g. pledge^4 hijrah')).toBeInTheDocument();
      expect(screen.getByText('Boolean Operators e.g. ("pledge allegiance" OR "shelter") AND prayer')).toBeInTheDocument();
      
      // Check if the "More" link is present and points to the correct page
      const moreLink = screen.getByText('More');
      expect(moreLink).toBeInTheDocument();
      expect(moreLink.closest('a')).toHaveAttribute('href', '/searchtips');
    });
  });
});
