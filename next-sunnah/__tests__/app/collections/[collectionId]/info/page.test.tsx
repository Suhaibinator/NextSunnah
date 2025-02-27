import React from 'react';
import { render, screen } from '@/test-utils';
import CollectionInfoPage from '@/app/collections/[collectionId]/info/page';
import { collections } from '@/data/collections';
import { notFound } from 'next/navigation';

// Mock the collections data
jest.mock('@/data/collections', () => ({
  collections: [
    {
      id: 'bukhari',
      name: 'Sahih al-Bukhari',
      nameArabic: 'صحيح البخاري',
      description: 'Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari.',
      bookCount: 97,
      hadithCount: 7563,
    },
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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('CollectionInfoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders collection information correctly for known collection', async () => {
    const props = {
      params: Promise.resolve({ collectionId: 'bukhari' }),
    };

    render(await CollectionInfoPage(props));
    
    // Check if collection name is rendered
    expect(screen.getByText('Sahih al-Bukhari')).toBeInTheDocument();
    
    // Check if Arabic name is rendered (using getAllByText since it appears in both mobile and desktop views)
    const arabicNameElements = screen.getAllByText('صحيح البخاري');
    expect(arabicNameElements.length).toBeGreaterThan(0);
    
    // Check if metadata is rendered (using getAllByText since it appears in both mobile and desktop views)
    const booksElements = screen.getAllByText('97 Books');
    expect(booksElements.length).toBeGreaterThan(0);
    
    const hadithsElements = screen.getAllByText('7563 Hadiths');
    expect(hadithsElements.length).toBeGreaterThan(0);
    
    // Check if back link is rendered
    const backLink = screen.getByText('← Back to Collection');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/collections/bukhari');
    
    // Check if section titles are rendered
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Historical Period')).toBeInTheDocument();
    expect(screen.getByText('Methodology')).toBeInTheDocument();
    expect(screen.getByText('Significance')).toBeInTheDocument();
    
    // Check if collection description is rendered
    expect(screen.getByText('Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari.')).toBeInTheDocument();
    
    // Check if specific collection info is rendered
    expect(screen.getByText(/Imam Muhammad ibn Ismail al-Bukhari/)).toBeInTheDocument();
    expect(screen.getByText(/Compiled during the 3rd century AH/)).toBeInTheDocument();
    expect(screen.getByText(/Imam Bukhari applied stringent criteria/)).toBeInTheDocument();
    expect(screen.getByText(/Sahih al-Bukhari is considered the most authentic book/)).toBeInTheDocument();
  });
  
  test('renders collection information correctly for unknown collection with default info', async () => {
    const props = {
      params: Promise.resolve({ collectionId: 'test-collection' }),
    };

    render(await CollectionInfoPage(props));
    
    // Check if collection name is rendered
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    
    // Check if default info is rendered when specific collection info is not available
    const defaultInfoElements = screen.getAllByText('Information not available');
    expect(defaultInfoElements.length).toBeGreaterThan(0);
  });
  
  test('calls notFound when collection is not found', async () => {
    const props = {
      params: Promise.resolve({ collectionId: 'non-existent-collection' }),
    };

    await CollectionInfoPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
});
