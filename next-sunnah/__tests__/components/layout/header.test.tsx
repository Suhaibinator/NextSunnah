import React from 'react';
import { render, screen, fireEvent, act, within } from '@/test-utils';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock window.scrollY and scroll event
const mockScrollY = jest.fn();
Object.defineProperty(window, 'scrollY', {
  get: () => mockScrollY(),
});

// Mock the SearchBar component
jest.mock('@/components/search-bar', () => ({
  SearchBar: ({ size }: { size?: string }) => (
    <div data-testid="search-bar" data-size={size}>
      Search Bar
    </div>
  ),
}));

// Mock the ThemeToggle component
jest.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: ({ showText, className }: { showText?: boolean; className?: string }) => (
    <button 
      aria-label="Toggle theme" 
      data-testid="theme-toggle"
      data-show-text={showText ? 'true' : 'false'}
      className={className}
    >
      Toggle Theme
    </button>
  ),
}));

describe('Header component', () => {
  beforeEach(() => {
    // Default to homepage
    (usePathname as jest.Mock).mockReturnValue('/');
    // Reset mock for scrollY
    mockScrollY.mockReturnValue(0);
    // Reset any event listeners
    jest.clearAllMocks();
  });
  
  test('renders navigation links', () => {
    render(<Header />);
    
    // Check if the Home link is rendered in desktop navigation
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Check if the Collections link is rendered in desktop navigation
    const collectionsLink = screen.getByRole('link', { name: /collections/i });
    expect(collectionsLink).toBeInTheDocument();
    expect(collectionsLink).toHaveAttribute('href', '/collections');
  });
  
  test('renders the theme toggle', () => {
    render(<Header />);
    
    // Check if the theme toggle button is rendered
    const themeToggleButton = screen.getByTestId('theme-toggle');
    expect(themeToggleButton).toBeInTheDocument();
  });
  
  test('does not render search bar on homepage', () => {
    // Mock pathname to be homepage
    (usePathname as jest.Mock).mockReturnValue('/');
    
    render(<Header />);
    
    // Check that search bar is not rendered
    expect(screen.queryByTestId('search-bar')).not.toBeInTheDocument();
  });
  
  test('renders search bar on non-homepage routes', () => {
    // Mock pathname to be a non-homepage route
    (usePathname as jest.Mock).mockReturnValue('/collections');
    
    render(<Header />);
    
    // Check that search bar is rendered with compact size
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveAttribute('data-size', 'compact');
  });
  
  test('toggles mobile menu when menu button is clicked', () => {
    render(<Header />);
    
    // Initially, mobile menu should not be visible
    const initialHomeLinks = screen.getAllByText('Home', { selector: 'a' });
    expect(initialHomeLinks.length).toBe(1); // Only desktop nav visible
    
    // Find and click the menu button
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    
    // After clicking, mobile menu should be visible with both nav items
    const homeLinksAfterClick = screen.getAllByText('Home', { selector: 'a' });
    expect(homeLinksAfterClick.length).toBe(2); // Both desktop and mobile nav
    
    const collectionsLinksAfterClick = screen.getAllByText('Collections', { selector: 'a' });
    expect(collectionsLinksAfterClick.length).toBe(2);
    
    // The button should now be a close button
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });
  
  test('closes mobile menu when a nav link is clicked', () => {
    render(<Header />);
    
    // Open the mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    
    // Find and click a nav link in the mobile menu
    const mobileLinks = screen.getAllByText('Home', { selector: 'a' });
    // The second link should be in the mobile menu
    fireEvent.click(mobileLinks[1]);
    
    // After clicking, mobile menu should be closed
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });
  
  test('applies active styles to current route link', () => {
    // Mock pathname to be the collections page
    (usePathname as jest.Mock).mockReturnValue('/collections');
    
    render(<Header />);
    
    // Get all navigation links
    const navLinks = screen.getAllByRole('link', { name: /collections|home/i });
    
    // Find the collections link in desktop navigation (first occurrence)
    const collectionsLink = navLinks.find(link => 
      link.textContent === 'Collections' && !link.closest('[class*="fixed"]')
    );
    
    // Check if it has the active class (text-primary)
    expect(collectionsLink).toHaveClass('text-primary');
    
    // Find the home link in desktop navigation
    const homeLink = navLinks.find(link => 
      link.textContent === 'Home' && !link.closest('[class*="fixed"]')
    );
    
    // Check if it doesn't have the active class
    expect(homeLink).not.toHaveClass('text-primary');
    expect(homeLink).toHaveClass('text-muted-foreground');
  });

  test('renders subheader with correct links', () => {
    render(<Header />);
    
    // Get the subheader container first
    const subheaderContainer = screen.getByText(/qur'an/i).closest('nav');
    expect(subheaderContainer).not.toBeNull();
    
    if (subheaderContainer) {
      // Check if the subheader links are rendered within the subheader container
      const quranLink = within(subheaderContainer).getByText(/qur'an/i);
      expect(quranLink).toBeInTheDocument();
      expect(quranLink).toHaveAttribute('href', '/quran');
      
      const sunnahLink = within(subheaderContainer).getByText(/sunnah/i);
      expect(sunnahLink).toBeInTheDocument();
      expect(sunnahLink).toHaveAttribute('href', '/sunnah');
      expect(sunnahLink).toHaveClass('font-bold');
      
      const prayerTimesLink = within(subheaderContainer).getByText(/prayer times/i);
      expect(prayerTimesLink).toBeInTheDocument();
      expect(prayerTimesLink).toHaveAttribute('href', '/prayer-times');
      
      const audioLink = within(subheaderContainer).getByText(/audio/i);
      expect(audioLink).toBeInTheDocument();
      expect(audioLink).toHaveAttribute('href', '/audio');
    }
  });
  
  test('hides subheader when scrolling down and shows when scrolling up', () => {
    render(<Header />);
    
    // Get the subheader div (the one with the transition classes)
    const quranElement = screen.getByText(/qur'an/i);
    const containerDiv = quranElement.closest('div');
    expect(containerDiv).not.toBeNull();
    
    if (containerDiv && containerDiv.parentElement) {
      const subheader = containerDiv.parentElement;
      
      // Initially, subheader should be visible
      expect(subheader).toHaveClass('h-8');
      expect(subheader).toHaveClass('opacity-100');
      expect(subheader).not.toHaveClass('opacity-0');
      
      // Simulate scrolling down
      mockScrollY.mockReturnValue(100);
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      
      // Subheader should now be hidden
      expect(subheader).toHaveClass('h-0');
      expect(subheader).toHaveClass('opacity-0');
      expect(subheader).not.toHaveClass('opacity-100');
      
      // Simulate scrolling up
      mockScrollY.mockReturnValue(50);
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      
      // Subheader should be visible again
      expect(subheader).toHaveClass('h-8');
      expect(subheader).toHaveClass('opacity-100');
      expect(subheader).not.toHaveClass('opacity-0');
    }
  });
});
