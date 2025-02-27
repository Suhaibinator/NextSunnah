import React from 'react';
import { render, screen } from '@/test-utils';
import CollectionsPage from '@/app/collections/page';
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
  ],
}));

// Mock the CollectionCard component
jest.mock('@/components/collection-card', () => ({
  CollectionCard: ({ collection }: any) => (
    <div data-testid="collection-card">
      <div>{collection.name}</div>
    </div>
  ),
}));

// Mock the SearchBar component
jest.mock('@/components/search-bar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

describe('CollectionsPage', () => {
  test('renders the page title and description', () => {
    render(<CollectionsPage />);
    
    // Check if the page title is rendered
    expect(screen.getByText('Hadith Collections')).toBeInTheDocument();
    
    // Check if the page description is rendered
    expect(
      screen.getByText('Browse through authentic collections of hadith compiled by renowned scholars.')
    ).toBeInTheDocument();
  });
  
  test('renders the search bar', () => {
    render(<CollectionsPage />);
    
    // Check if the search bar is rendered
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });
  
  test('renders collection cards for each collection', () => {
    render(<CollectionsPage />);
    
    // Check if collection cards are rendered for each collection
    const collectionCards = screen.getAllByTestId('collection-card');
    expect(collectionCards).toHaveLength(2);
    
    // Check if collection names are rendered
    expect(screen.getByText('Test Collection 1')).toBeInTheDocument();
    expect(screen.getByText('Test Collection 2')).toBeInTheDocument();
  });
  
  test('renders the information section', () => {
    render(<CollectionsPage />);
    
    // Check if the information section title is rendered
    expect(screen.getByText('About Hadith Collections')).toBeInTheDocument();
    
    // Check if the information section content is rendered
    expect(
      screen.getByText(/Hadith are the collected sayings, actions, and silent approvals of Prophet Muhammad/i)
    ).toBeInTheDocument();
    
    expect(
      screen.getByText(/The most authentic collections are known as/i)
    ).toBeInTheDocument();
  });
});
