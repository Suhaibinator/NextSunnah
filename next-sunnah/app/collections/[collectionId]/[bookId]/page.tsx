import Link from "next/link"
import { notFound } from "next/navigation"
import { collections } from "@/data/collections"
import { getBooksByCollection } from "@/data/books"
import { getHadithsByChapter } from "@/data/hadiths"
import { SearchBar } from "@/components/search-bar"
import { fetchChaptersForBook, fetchHadithsForBook } from "@/lib/api"
import { Hadith, Chapter } from "@/types"

interface BookPageProps {
  params: Promise<{
    collectionId: string
    bookId: string
  }>
}

export async function generateMetadata(props: BookPageProps) {
  const params = await props.params;
  const collection = collections.find(c => c.id === params.collectionId)
  const books = getBooksByCollection(params.collectionId)
  const book = books.find(b => b.id === params.bookId)

  if (!collection || !book) {
    return {
      title: "Book Not Found - Sunnah.com",
    }
  }

  return {
    title: `${book.name} - ${collection.name} - Sunnah.com`,
    description: `${book.name} from ${collection.name} containing ${book.hadithCount} hadiths.`,
  }
}

export default async function BookPage(props: BookPageProps) {
  const params = await props.params;
  const collection = collections.find(c => c.id === params.collectionId)
  const books = getBooksByCollection(params.collectionId)
  const book = books.find(b => b.id === params.bookId)

  if (!collection || !book) {
    notFound()
  }

  // Try to fetch chapters and hadiths from API
  let chapters: Chapter[] = [];
  const apiHadiths = new Map(); // Map to store hadiths by chapter ID
  
  try {
    // Extract the book number from the book ID (e.g., "bukhari-1" -> "1")
    const bookNumber = book.number;
    
    // Fetch chapters from the API
    const chaptersData = await fetchChaptersForBook(collection.id, bookNumber);
    chapters = chaptersData.chapters;
    
    // If no chapters were returned from the API, log a warning
    if (chapters.length === 0) {
      console.warn(`No chapters found for book ${book.id}`);
    }
    
    // Fetch hadiths for this book
    try {
      const hadithsData = await fetchHadithsForBook(collection.id, bookNumber);
      
      // Group hadiths by chapter ID
      hadithsData.hadiths.forEach(hadith => {
        if (!apiHadiths.has(hadith.chapterId)) {
          apiHadiths.set(hadith.chapterId, []);
        }
        apiHadiths.get(hadith.chapterId).push(hadith);
      });
    } catch (hadithError) {
      console.error("Error fetching hadiths from API:", hadithError);
      // We'll fall back to static data for hadiths
    }
  } catch (error) {
    console.error("Error fetching chapters from API:", error);
    // Log error and continue with empty chapters array
    // The UI will show "No chapters available for this book"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/collections/${collection.id}`} 
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Back to {collection.name}
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              {collection.name}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                {book.number}. {book.name}
              </h1>
              <p className="arabic text-2xl font-medium text-right">{book.nameArabic}</p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div>{book.hadithCount} Hadiths</div>
            <div>{book.chapterCount} Chapters</div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <SearchBar />
        </div>
      </div>
      
      {/* Chapters and Hadiths */}
      <div className="space-y-12">
        {chapters.map((chapter) => {
          // Try to get hadiths from API first, fall back to static data if needed
          const hadiths = apiHadiths.has(chapter.id) 
            ? apiHadiths.get(chapter.id) 
            : getHadithsByChapter(chapter.id);
          
          return (
            <div key={chapter.id} className="border-t pt-8">
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <h2 className="text-xl font-bold">
                    Chapter {chapter.number}: {chapter.name}
                  </h2>
                  <p className="arabic text-lg text-right">{chapter.nameArabic}</p>
                </div>
                
                {/* Display chapter intro if available */}
                {chapter.intro && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p className="italic text-muted-foreground">{chapter.intro}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                {hadiths.map((hadith: Hadith) => (
                  <Link 
                    key={hadith.id}
                    href={`/collections/${collection.id}/${book.id}/${hadith.id}`}
                    className="block"
                  >
                    <div className="p-6 rounded-lg border bg-card hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                            Hadith {hadith.number}
                          </span>
                          {hadith.grade && (
                            <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-sm">
                              {hadith.grade}
                            </span>
                          )}
                          {hadith.grades && hadith.grades.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hadith.grades.map((gradeInfo, index) => (
                                <span key={index} className="bg-secondary/5 text-secondary-foreground px-2 py-1 rounded text-xs">
                                  {gradeInfo.graded_by}: {gradeInfo.grade}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {hadith.narrator && (
                          <div className="text-sm text-muted-foreground">
                            {hadith.narrator}
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <p className="line-clamp-3">{hadith.text}</p>
                      </div>
                      
                      <div className="arabic text-right">
                        <p className="line-clamp-3">{hadith.textArabic}</p>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {hadiths.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    No hadiths available for this chapter.
                  </div>
                )}
              </div>
              
              {/* Display chapter ending if available */}
              {chapter.ending && (
                <div className="mt-6 p-4 bg-muted rounded-md">
                  <p className="italic text-muted-foreground">{chapter.ending}</p>
                </div>
              )}
            </div>
          )
        })}
        
        {chapters.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No chapters available for this book.
          </div>
        )}
      </div>
    </div>
  )
}
