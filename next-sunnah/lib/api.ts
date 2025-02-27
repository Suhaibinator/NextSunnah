import { Book, Chapter, Collection, Hadith } from "@/types";

// Define the API response types based on the documentation
// Define the API response type for collections
interface CollectionApiResponse {
  data: {
    name: string;
    hasBooks: boolean;
    hasChapters: boolean;
    collection: {
      lang: string;
      title: string;
      shortIntro: string;
    }[];
    totalHadith: number;
    totalAvailableHadith: number;
  }[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}

interface BookApiResponse {
  data: {
    bookNumber: string;
    book: {
      name?: string;
      arabicName?: string;
    }[];
    hadithStartNumber: number;
    hadithEndNumber: number;
    numberOfHadith: number;
  }[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}

// Define the API response type for chapters
interface ChapterApiResponse {
  data: {
    bookNumber: string;
    chapterId: string;
    chapter: {
      lang: string;
      chapterNumber: string;
      chapterTitle: string;
      intro: string | null;
      ending: string | null;
    }[];
  }[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}

// Define the API response type for hadiths
interface HadithApiResponse {
  data: {
    collection: string;
    bookNumber: string;
    chapterId: string;
    hadithNumber: string;
    hadith: {
      lang: string;
      chapterNumber?: string;
      chapterTitle?: string;
      urn?: number;
      body: string;
      grade?: string;
      narrator?: string;
    }[];
    grades?: {
      graded_by: string;
      grade: string;
    }[];
  }[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}

/**
 * Fetches chapters for a given book in a collection from the Sunnah.com API
 * @param collectionName - The name of the collection
 * @param bookNumber - The number of the book to fetch chapters for
 * @param limit - Maximum number of items to return (default: 50, max: 100)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with the chapters data
 */
export async function fetchChaptersForBook(
  collectionName: string,
  bookNumber: string | number,
  limit: number = 50,
  page: number = 1
): Promise<{
  chapters: Chapter[];
  pagination: {
    total: number;
    limit: number;
    previous: number | null;
    next: number | null;
  };
}> {
  // Get the API key from environment variables
  const apiKey = process.env.SUNNAH_API_KEY;
  
  if (!apiKey) {
    throw new Error("SUNNAH_API_KEY environment variable is not set");
  }

  // Convert bookNumber to string if it's a number
  const bookNumberStr = typeof bookNumber === 'number' ? bookNumber.toString() : bookNumber;

  try {
    const response = await fetch(
      `https://api.sunnah.com/v1/collections/${collectionName}/books/${bookNumberStr}/chapters?limit=${limit}&page=${page}`,
      {
        headers: {
          "X-API-Key": apiKey,
        },
        // Next.js cache settings - adjust as needed
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ChapterApiResponse = await response.json();

    // Transform the API response to match our Chapter interface
    const chapters: Chapter[] = data.data.map((item, index) => {
      // Find the English chapter data
      const englishChapter = item.chapter.find(c => c.lang === 'en');
      // Find the Arabic chapter data
      const arabicChapter = item.chapter.find(c => c.lang === 'ar');
      
      // Get the chapter title or use a default
      const name = englishChapter?.chapterTitle || `Chapter ${index + 1}`;
      // Get the Arabic chapter title or use an empty string
      const nameArabic = arabicChapter?.chapterTitle || "";
      
      // Get intro and ending text from English chapter
      const intro = englishChapter?.intro || undefined;
      const ending = englishChapter?.ending || undefined;

      return {
        id: `${collectionName}-${bookNumberStr}-${item.chapterId}`,
        bookId: `${collectionName}-${bookNumberStr}`,
        name,
        nameArabic,
        number: parseInt(item.chapterId),
        intro,
        ending,
      };
    });

    return {
      chapters,
      pagination: {
        total: data.total,
        limit: data.limit,
        previous: data.previous,
        next: data.next,
      },
    };
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
}

/**
 * Fetches books for a given collection from the Sunnah.com API
 * @param collectionName - The name of the collection to fetch books for
 * @param limit - Maximum number of items to return (default: 50, max: 100)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with the books data
 */
export async function fetchBooksForCollection(
  collectionName: string,
  limit: number = 50,
  page: number = 1
): Promise<{
  books: Book[];
  pagination: {
    total: number;
    limit: number;
    previous: number | null;
    next: number | null;
  };
}> {
  // Get the API key from environment variables
  const apiKey = process.env.SUNNAH_API_KEY;
  
  if (!apiKey) {
    throw new Error("SUNNAH_API_KEY environment variable is not set");
  }

  try {
    const response = await fetch(
      `https://api.sunnah.com/v1/collections/${collectionName}/books?limit=${limit}&page=${page}`,
      {
        headers: {
          "X-API-Key": apiKey,
        },
        // Next.js cache settings - adjust as needed
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: BookApiResponse = await response.json();

    // Transform the API response to match our Book interface
    const books: Book[] = data.data.map((item) => {
      // Get the English name from the book array (assuming first item is English)
      const name = item.book[0]?.name || `Book ${item.bookNumber}`;
      // Get the Arabic name from the book array (assuming second item is Arabic)
      const nameArabic = item.book[1]?.arabicName || "";

      return {
        id: `${collectionName}-${item.bookNumber}`,
        collectionId: collectionName,
        name,
        nameArabic,
        hadithCount: item.numberOfHadith,
        chapterCount: 0, // API doesn't provide chapter count, default to 0
        number: parseInt(item.bookNumber),
      };
    });

    return {
      books,
      pagination: {
        total: data.total,
        limit: data.limit,
        previous: data.previous,
        next: data.next,
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

/**
 * Fetches hadiths for a given book in a collection from the Sunnah.com API
 * @param collectionName - The name of the collection
 * @param bookNumber - The number of the book to fetch hadiths for
 * @param limit - Maximum number of items to return (default: 50, max: 100)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with the hadiths data
 */
/**
 * Fetches a single hadith by its number from the Sunnah.com API
 * @param collectionName - The name of the collection
 * @param bookNumber - The number of the book
 * @param hadithNumber - The number of the hadith to fetch
 * @returns Promise with the hadith data
 */
export async function fetchHadithByNumber(
  collectionName: string,
  bookNumber: string | number,
  hadithNumber: string | number
): Promise<Hadith | null> {
  // Get the API key from environment variables
  const apiKey = process.env.SUNNAH_API_KEY;
  
  if (!apiKey) {
    throw new Error("SUNNAH_API_KEY environment variable is not set");
  }

  // Convert numbers to strings if needed
  const bookNumberStr = typeof bookNumber === 'number' ? bookNumber.toString() : bookNumber;
  const hadithNumberStr = typeof hadithNumber === 'number' ? hadithNumber.toString() : hadithNumber;

  try {
    const response = await fetch(
      `https://api.sunnah.com/v1/collections/${collectionName}/books/${bookNumberStr}/hadiths/${hadithNumberStr}`,
      {
        headers: {
          "X-API-Key": apiKey,
        },
        // Next.js cache settings - adjust as needed
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Hadith not found
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // The API returns a single hadith object, not an array
    const item = data.data;
    
    if (!item) {
      return null;
    }

    // Find the English hadith text (assuming first item with lang 'en' is English)
    const englishHadith = item.hadith.find((h: { lang: string; body: string; narrator?: string; grade?: string; chapterNumber?: string; chapterTitle?: string; urn?: number }) => h.lang === 'en');
    // Find the Arabic hadith text (assuming first item with lang 'ar' is Arabic)
    const arabicHadith = item.hadith.find((h: { lang: string; body: string }) => h.lang === 'ar');
    
    // Get the narrator and grade from the English hadith if available
    const narrator = englishHadith?.narrator || '';
    const grade = englishHadith?.grade || '';

    return {
      id: `${collectionName}-${bookNumberStr}-${item.hadithNumber}`,
      collectionId: collectionName,
      bookId: `${collectionName}-${bookNumberStr}`,
      chapterId: `${collectionName}-${bookNumberStr}-${item.chapterId}`,
      number: parseInt(item.hadithNumber),
      text: englishHadith?.body || '',
      textArabic: arabicHadith?.body || '',
      grade,
      narrator,
      // Add the new fields from the API
      chapterNumber: englishHadith?.chapterNumber,
      chapterTitle: englishHadith?.chapterTitle,
      urn: englishHadith?.urn,
      // Add the grades array if available
      grades: item.grades,
    };
  } catch (error) {
    console.error("Error fetching hadith:", error);
    throw error;
  }
}

/**
 * Fetches all available collections from the Sunnah.com API
 * @param limit - Maximum number of items to return (default: 50, max: 100)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with the collections data
 */
export async function fetchCollections(
  limit: number = 50,
  page: number = 1
): Promise<{
  collections: Collection[];
  pagination: {
    total: number;
    limit: number;
    previous: number | null;
    next: number | null;
  };
}> {
  // Get the API key from environment variables
  const apiKey = process.env.SUNNAH_API_KEY;
  
  if (!apiKey) {
    throw new Error("SUNNAH_API_KEY environment variable is not set");
  }

  try {
    const response = await fetch(
      `https://api.sunnah.com/v1/collections?limit=${limit}&page=${page}`,
      {
        headers: {
          "X-API-Key": apiKey,
        },
        // Next.js cache settings - adjust as needed
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: CollectionApiResponse = await response.json();

    // Transform the API response to match our Collection interface
    const collections: Collection[] = data.data.map((item) => {
      // Find the English collection data
      const englishCollection = item.collection.find(c => c.lang === 'en');
      // Find the Arabic collection data
      const arabicCollection = item.collection.find(c => c.lang === 'ar');
      
      // Get the collection name or use the API name as fallback
      const name = englishCollection?.title || item.name;
      // Get the Arabic collection name or use an empty string
      const nameArabic = arabicCollection?.title || "";
      // Get the description from the shortIntro or use a default
      const description = englishCollection?.shortIntro || `Collection of hadith from ${name}`;

      return {
        id: item.name.toLowerCase(),
        name,
        nameArabic,
        description,
        bookCount: 0, // Will be updated when we fetch books
        hadithCount: item.totalHadith,
        // Add the new fields from the API
        hasBooks: item.hasBooks,
        hasChapters: item.hasChapters,
        totalAvailableHadith: item.totalAvailableHadith,
        shortIntro: englishCollection?.shortIntro || "",
      };
    });

    return {
      collections,
      pagination: {
        total: data.total,
        limit: data.limit,
        previous: data.previous,
        next: data.next,
      },
    };
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
}

export async function fetchHadithsForBook(
  collectionName: string,
  bookNumber: string | number,
  limit: number = 50,
  page: number = 1
): Promise<{
  hadiths: Hadith[];
  pagination: {
    total: number;
    limit: number;
    previous: number | null;
    next: number | null;
  };
}> {
  // Get the API key from environment variables
  const apiKey = process.env.SUNNAH_API_KEY;
  
  if (!apiKey) {
    throw new Error("SUNNAH_API_KEY environment variable is not set");
  }

  // Convert bookNumber to string if it's a number
  const bookNumberStr = typeof bookNumber === 'number' ? bookNumber.toString() : bookNumber;

  try {
    const response = await fetch(
      `https://api.sunnah.com/v1/collections/${collectionName}/books/${bookNumberStr}/hadiths?limit=${limit}&page=${page}`,
      {
        headers: {
          "X-API-Key": apiKey,
        },
        // Next.js cache settings - adjust as needed
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: HadithApiResponse = await response.json();

    // Transform the API response to match our Hadith interface
    const hadiths: Hadith[] = data.data.map((item) => {
      // Find the English hadith text (assuming first item with lang 'en' is English)
      const englishHadith = item.hadith.find(h => h.lang === 'en');
      // Find the Arabic hadith text (assuming first item with lang 'ar' is Arabic)
      const arabicHadith = item.hadith.find(h => h.lang === 'ar');
      
      // Get the narrator and grade from the English hadith if available
      const narrator = englishHadith?.narrator || '';
      const grade = englishHadith?.grade || '';

      return {
        id: `${collectionName}-${bookNumberStr}-${item.hadithNumber}`,
        collectionId: collectionName,
        bookId: `${collectionName}-${bookNumberStr}`,
        chapterId: `${collectionName}-${bookNumberStr}-${item.chapterId}`,
        number: parseInt(item.hadithNumber),
        text: englishHadith?.body || '',
        textArabic: arabicHadith?.body || '',
        grade,
        narrator,
        // Add the new fields from the API
        chapterNumber: englishHadith?.chapterNumber,
        chapterTitle: englishHadith?.chapterTitle,
        urn: englishHadith?.urn,
        // Add the grades array if available
        grades: item.grades,
      };
    });

    return {
      hadiths,
      pagination: {
        total: data.total,
        limit: data.limit,
        previous: data.previous,
        next: data.next,
      },
    };
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    throw error;
  }
}
