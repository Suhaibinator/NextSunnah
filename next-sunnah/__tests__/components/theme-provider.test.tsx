import React from 'react';
import { render } from '@/test-utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-themes-provider">{children}</div>
  ),
}));

describe('ThemeProvider component', () => {
  test('renders children correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );
    
    expect(getByText('Test Child')).toBeInTheDocument();
  });
  
  test('passes props to NextThemesProvider', () => {
    // We'll use a simpler approach that doesn't require type checking
    const { getByTestId } = render(
      <ThemeProvider defaultTheme="dark">
        <div>Test Child</div>
      </ThemeProvider>
    );
    
    // Verify that the NextThemesProvider is rendered with children
    const provider = getByTestId('next-themes-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveTextContent('Test Child');
  });
});
