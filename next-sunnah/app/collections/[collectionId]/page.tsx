import Link from "next/link"
import { notFound } from "next/navigation"
import { collections } from "@/data/collections"
import { getBooksByCollection } from "@/data/books"
import { SearchBar } from "@/components/search-bar"

interface CollectionPageProps {
  params: Promise<{
    collectionId: string
  }>
}

export async function generateMetadata(props: CollectionPageProps) {
  const params = await props.params;
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

export default async function CollectionPage(props: CollectionPageProps) {
  const params = await props.params;
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
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">{collection.name}</h1>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="arabic text-2xl font-medium">{collection.nameArabic}</p>
            <div className="text-sm text-muted-foreground mt-2">
              <div>{collection.bookCount} Books</div>
              <div>{collection.hadithCount} Hadiths</div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          {collection.description}
        </p>
        
        {/* More Information Link */}
        <div className="mb-6">
          <Link 
            href={`/collections/${collection.id}/info`}
            className="text-primary hover:underline inline-block"
          >
            More Information
          </Link>
        </div>
        
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
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">{book.number}.</span>
                    <h3 className="font-medium">{book.name}</h3>
                  </div>
                  <p className="arabic text-right">{book.nameArabic}</p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div>{book.hadithCount} Hadiths</div>
                    <div>{book.chapterCount} Chapters</div>
                  </div>
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
