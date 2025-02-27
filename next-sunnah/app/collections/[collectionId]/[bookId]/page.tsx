import Link from "next/link"
import { notFound } from "next/navigation"
import { collections } from "@/data/collections"
import { getBooksByCollection } from "@/data/books"
import { getChaptersByBook } from "@/data/chapters"
import { getHadithsByChapter } from "@/data/hadiths"
import { SearchBar } from "@/components/search-bar"

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

  const chapters = getChaptersByBook(book.id)

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {book.number}. {book.name}
            </h1>
            <p className="arabic text-2xl font-medium mb-4">{book.nameArabic}</p>
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
          const hadiths = getHadithsByChapter(chapter.id)
          
          return (
            <div key={chapter.id} className="border-t pt-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">
                  Chapter {chapter.number}: {chapter.name}
                </h2>
                <p className="arabic text-lg">{chapter.nameArabic}</p>
              </div>
              
              <div className="space-y-8">
                {hadiths.map((hadith) => (
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
