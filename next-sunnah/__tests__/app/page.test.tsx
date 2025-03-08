import React from 'react';
import { render, screen } from '@/test-utils';
import HomePage from '@/app/page';
import { collections } from '@/data/collections';

// Mock the collections data
jest.mock('@/data/collections', () => ({
  collections: [
    {
      id: 'test-collection-1',
      name: 'Test Collection 1',
      nameArabic: 'اختبار المجموعة 1',
      description: 'This is test collection 1',
      bookCount: 10,
      hadithCount: 500,
    },
    {
      id: 'test-collection-2',
      name: 'Test Collection 2',
      nameArabic: 'اختبار المجموعة 2',
      description: 'This is test collection 2',
      bookCount: 20,
      hadithCount: 1000,
    },
    {
      id: 'test-collection-3',
      name: 'Test Collection 3',
      nameArabic: 'اختبار المجموعة 3',
      description: 'This is test collection 3',
      bookCount: 30,
      hadithCount: 1500,
    },
    {
      id: 'test-collection-4',
      name: 'Test Collection 4',
      nameArabic: 'اختبار المجموعة 4',
      description: 'This is test collection 4',
      bookCount: 40,
      hadithCount: 2000,
    },
    {
      id: 'test-collection-5',
      name: 'Test Collection 5',
      nameArabic: 'اختبار المجموعة 5',
      description: 'This is test collection 5',
      bookCount: 50,
      hadithCount: 2500,
    },
  ],
}));

// Mock the SearchBar component
jest.mock('@/components/search-bar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

// Mock the CollectionCard component
jest.mock('@/components/collection-card', () => ({
  CollectionCard: ({ collection }: any) => (
    <div data-testid="collection-card">
      <div>{collection.name}</div>
    </div>
  ),
}));

describe('HomePage', () => {
  test('renders the hero section with title and description', () => {
    render(<HomePage />);
     
    // Check if the description is rendered - using regex to handle the text being split across elements
    expect(
      screen.getByText(/The Hadith of the Prophet Muhammad.*at your fingertips/i)
    ).toBeInTheDocument();
    
    // Check if the Arabic text is properly styled
    const arabicTexts = screen.getAllByText(/صلى الله عليه و سلم/);
    expect(arabicTexts[0]).toHaveClass('arabic'); // First occurrence in the hero section
  });
  
  test('renders the search bar', () => {
    render(<HomePage />);
    
    // Check if the search bar is rendered
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });
  
  test('renders the browse collections button with correct link', () => {
    render(<HomePage />);
    
    // Check if the browse collections button is rendered
    const browseButton = screen.getByText('Browse Collections');
    expect(browseButton).toBeInTheDocument();
    expect(browseButton.closest('a')).toHaveAttribute('href', '/collections');
  });
  
  test('renders the featured collections section with title', () => {
    render(<HomePage />);
    
    // Check if the featured collections title is rendered
    expect(screen.getByText('Featured Collections')).toBeInTheDocument();
    
    // Check if the view all link is rendered
    const viewAllLink = screen.getByText('View All');
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/collections');
  });
  
  test('renders the correct number of featured collections', () => {
    render(<HomePage />);
    
    // Check if 4 collection cards are rendered
    const collectionCards = screen.getAllByTestId('collection-card');
    expect(collectionCards).toHaveLength(4);
    
    // Check if the first 4 collections are rendered
    expect(screen.getByText('Test Collection 1')).toBeInTheDocument();
    expect(screen.getByText('Test Collection 2')).toBeInTheDocument();
    expect(screen.getByText('Test Collection 3')).toBeInTheDocument();
    expect(screen.getByText('Test Collection 4')).toBeInTheDocument();
    
    // Check if the 5th collection is not rendered
    expect(screen.queryByText('Test Collection 5')).not.toBeInTheDocument();
  });
  
  test('renders the about section with title and description', () => {
    render(<HomePage />);
    
    // Check if the about section title is rendered
    expect(screen.getByText('About Sunnah.com')).toBeInTheDocument();
    
    // Check if the about section description is rendered
    expect(
      screen.getByText(/Sunnah.com is a free resource for all Muslims/i)
    ).toBeInTheDocument();
    
    // Check if the Arabic text in the about section is properly styled
    const aboutArabicText = screen.getAllByText(/صلى الله عليه و سلم/)[1]; // Get the second occurrence
    expect(aboutArabicText).toHaveClass('arabic');
    
    expect(
      screen.getByText(/The collections include Sahih al-Bukhari/i)
    ).toBeInTheDocument();
  });
});
