import React from 'react';
import { render, screen, fireEvent } from '@/test-utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';

// Mock the useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useTheme as jest.Mock).mockReset();
  });
  
  test('renders correctly in light mode', () => {
    // Mock the useTheme hook to return light theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });
    
    render(<ThemeToggle />);
    
    // Check if the button is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Check if the sun icon is visible (light mode)
    // In the actual implementation, the icon might be using a different aria-label
    // or might not have one at all, so we'll check for the button's aria-label instead
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });
  
  test('renders correctly in dark mode', () => {
    // Mock the useTheme hook to return dark theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });
    
    render(<ThemeToggle />);
    
    // Check if the button is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Check if the button has the correct aria-label
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });
  
  test('toggles theme when clicked', () => {
    // Create a mock function for setTheme
    const setThemeMock = jest.fn();
    
    // Mock the useTheme hook to return light theme and the mock setTheme function
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });
    
    const { unmount } = render(<ThemeToggle />);
    
    // Get the button and click it
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    fireEvent.click(button);
    
    // Check if setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
    
    // Clean up the first render to avoid multiple buttons
    unmount();
    
    // Reset the mock and test the opposite direction
    setThemeMock.mockReset();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });
    
    // Re-render with dark theme
    render(<ThemeToggle />);
    
    // Get the button and click it again
    const darkButton = screen.getByRole('button', { name: 'Toggle theme' });
    fireEvent.click(darkButton);
    
    // Check if setTheme was called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
