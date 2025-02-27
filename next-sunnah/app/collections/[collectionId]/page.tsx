import Link from "next/link"
import { notFound } from "next/navigation"
import { collections } from "@/data/collections"
import { getBooksByCollection } from "@/data/books"
import { SearchBar } from "@/components/search-bar"

interface CollectionPageProps {
  params: {
    collectionId: string
  }
}

export function generateMetadata({ params }: CollectionPageProps) {
  const collection = collections.find(c => c.id === params.collectionId)
  
  if (!collection) {
    return {
      title: "Collection Not Found - Sunnah.com",
    }
  }
  
  return {
    title: `${collection.name} - Sunnah.com`,
    description: collection.description,
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = collections.find(c => c.id === params.collectionId)
  
  if (!collection) {
    notFound()
  }
  
  const books = getBooksByCollection(collection.id)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/collections" 
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Back to Collections
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{collection.name}</h1>
            <p className="arabic text-2xl font-medium mb-4">{collection.nameArabic}</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div>{collection.bookCount} Books</div>
            <div>{collection.hadithCount} Hadiths</div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6">
          {collection.description}
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <SearchBar />
        </div>
      </div>
      
      {/* Books List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Books</h2>
        
        <div className="grid gap-4">
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/collections/${collection.id}/${book.id}`}
              className="block p-4 rounded-lg border bg-card hover:border-primary transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">{book.number}.</span>
                    <h3 className="font-medium">{book.name}</h3>
                  </div>
                  <p className="arabic mt-1">{book.nameArabic}</p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>{book.hadithCount} Hadiths</div>
                  <div>{book.chapterCount} Chapters</div>
                </div>
              </div>
            </Link>
          ))}
          
          {books.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No books available for this collection.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
