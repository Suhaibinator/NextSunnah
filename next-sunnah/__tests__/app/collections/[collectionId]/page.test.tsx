import React from 'react';
import { render, screen } from '@/test-utils';
import CollectionPage from '@/app/collections/[collectionId]/page';
import { collections } from '@/data/collections';
import { bukhariBooks } from '@/data/books';
import { notFound } from 'next/navigation';

// Mock the collections data
jest.mock('@/data/collections', () => ({
  collections: [
    {
      id: 'test-collection',
      name: 'Test Collection',
      nameArabic: 'اختبار المجموعة',
      description: 'This is a test collection description',
      bookCount: 10,
      hadithCount: 500,
    },
  ],
}));

// Mock the books data
jest.mock('@/data/books', () => ({
  bukhariBooks: [],
  getBooksByCollection: jest.fn(() => [
    {
      id: 'test-book-1',
      collectionId: 'test-collection',
      name: 'Test Book 1',
      nameArabic: 'اختبار الكتاب 1',
      hadithCount: 100,
      chapterCount: 10,
      number: 1,
    },
    {
      id: 'test-book-2',
      collectionId: 'test-collection',
      name: 'Test Book 2',
      nameArabic: 'اختبار الكتاب 2',
      hadithCount: 200,
      chapterCount: 20,
      number: 2,
    },
  ]),
}));

// Mock the SearchBar component
jest.mock('@/components/search-bar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('CollectionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders collection information correctly', async () => {
    const props = {
      params: Promise.resolve({ collectionId: 'test-collection' }),
    };

    render(await CollectionPage(props));
    
    // Check if collection name is rendered
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    
    // Check if Arabic name is rendered (using getAllByText since it appears in both mobile and desktop views)
    const arabicNameElements = screen.getAllByText('اختبار المجموعة');
    expect(arabicNameElements.length).toBeGreaterThan(0);
    
    // Check if description is rendered
    expect(screen.getByText('This is a test collection description')).toBeInTheDocument();
    
    // Check if metadata is rendered (using getAllByText since it appears in both mobile and desktop views)
    const booksElements = screen.getAllByText('10 Books');
    expect(booksElements.length).toBeGreaterThan(0);
    
    const hadithsElements = screen.getAllByText('500 Hadiths');
    expect(hadithsElements.length).toBeGreaterThan(0);
    
    // Check if back link is rendered
    const backLink = screen.getByText('← Back to Collections');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/collections');
    
    // Check if more information link is rendered
    const moreInfoLink = screen.getByText('More Information');
    expect(moreInfoLink).toBeInTheDocument();
    expect(moreInfoLink.closest('a')).toHaveAttribute('href', '/collections/test-collection/info');
    
    // Check if search bar is rendered
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });
  
  test('renders books list correctly', async () => {
    const props = {
      params: Promise.resolve({ collectionId: 'test-collection' }),
    };

    render(await CollectionPage(props));
    
    // Check if books section title is rendered
    expect(screen.getByText('Books')).toBeInTheDocument();
    
    // Check if book items are rendered
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    expect(screen.getByText('اختبار الكتاب 1')).toBeInTheDocument();
    expect(screen.getByText('اختبار الكتاب 2')).toBeInTheDocument();
    
    // Check if book metadata is rendered
    expect(screen.getByText('100 Hadiths')).toBeInTheDocument();
    expect(screen.getByText('10 Chapters')).toBeInTheDocument();
    expect(screen.getByText('200 Hadiths')).toBeInTheDocument();
    expect(screen.getByText('20 Chapters')).toBeInTheDocument();
    
    // Check if book links point to the correct URLs
    const bookLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/test-book-')
    );
    expect(bookLinks[0]).toHaveAttribute('href', '/collections/test-collection/test-book-1');
    expect(bookLinks[1]).toHaveAttribute('href', '/collections/test-collection/test-book-2');
  });
  
  test('calls notFound when collection is not found', async () => {
    const props = {
      params: Promise.resolve({ collectionId: 'non-existent-collection' }),
    };

    await CollectionPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
  
  test('renders empty state when no books are available', async () => {
    // Mock getBooksByCollection to return an empty array
    require('@/data/books').getBooksByCollection.mockReturnValueOnce([]);
    
    const props = {
      params: Promise.resolve({ collectionId: 'test-collection' }),
    };

    render(await CollectionPage(props));
    
    // Check if empty state message is rendered
    expect(screen.getByText('No books available for this collection.')).toBeInTheDocument();
  });
});
