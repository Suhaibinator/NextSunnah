// app/collections/[collectionId]/[bookId]/[hadithId]/page.tsx

import Link from "next/link"
import { notFound } from "next/navigation"
import { collections } from "@/data/collections"
import { getBooksByCollection } from "@/data/books"
import { fetchChaptersForBook, fetchHadithByNumber } from "@/lib/api"
import { getHadithById } from "@/data/hadiths"
import { Chapter } from "@/types"

interface HadithParams {
  collectionId: string
  bookId: string
  hadithId: string
}

interface HadithPageProps {
  params: Promise<HadithParams | Promise<HadithParams>>
}

export async function generateMetadata(props: HadithPageProps) {
  const params = await props.params;
  // You can just use params directly, no need for Promise.resolve
  const { collectionId, bookId, hadithId } = params

  const collection = collections.find((c) => c.id === collectionId)
  const books = getBooksByCollection(collectionId)
  const book = books.find((b) => b.id === bookId)
  
  // Try to get the hadith number from the hadith ID
  // Format is typically "collectionId-bookNumber-hadithNumber"
  const hadithNumberMatch = hadithId.match(/^.*-(\d+)$/);
  const hadithNumber = hadithNumberMatch ? hadithNumberMatch[1] : null;
  
  // Try to fetch the hadith from the API first
  let hadith = null;
  try {
    if (hadithNumber && book) {
      hadith = await fetchHadithByNumber(collectionId, book.number, hadithNumber);
    }
  } catch (error) {
    console.error("Error fetching hadith from API for metadata:", error);
  }
  
  // Fall back to static data if API fetch failed
  if (!hadith) {
    hadith = getHadithById(hadithId);
  }

  if (!collection || !book || !hadith) {
    return {
      title: "Hadith Not Found - Sunnah.com",
    }
  }

  return {
    title: `Hadith ${hadith.number} - ${book.name} - ${collection.name} - Sunnah.com`,
    description: hadith.text.substring(0, 160) + "...",
  }
}

const HadithPage = async (props: HadithPageProps) => {
  const params = await props.params;
  const { collectionId, bookId, hadithId } = params

  const collection = collections.find((c) => c.id === collectionId)
  const books = getBooksByCollection(collectionId)
  const book = books.find((b) => b.id === bookId)
  
  // Try to get the hadith number from the hadith ID
  // Format is typically "collectionId-bookNumber-hadithNumber"
  const hadithNumberMatch = hadithId.match(/^.*-(\d+)$/);
  const hadithNumber = hadithNumberMatch ? hadithNumberMatch[1] : null;
  
  // Try to fetch the hadith from the API first
  let hadith = null;
  try {
    if (hadithNumber && book) {
      hadith = await fetchHadithByNumber(collectionId, book.number, hadithNumber);
    }
  } catch (error) {
    console.error("Error fetching hadith from API:", error);
  }
  
  // Fall back to static data if API fetch failed
  if (!hadith) {
    hadith = getHadithById(hadithId);
  }

  if (!collection || !book || !hadith) {
    notFound()
  }

  // Try to fetch chapters from API first, fall back to empty array if needed
  let chapters: Chapter[] = [];
  try {
    // Extract the book number from the book ID (e.g., "bukhari-1" -> "1")
    const bookNumber = book.number;
    
    // Fetch chapters from the API
    const chaptersData = await fetchChaptersForBook(collection.id, bookNumber);
    chapters = chaptersData.chapters;
  } catch (error) {
    console.error("Error fetching chapters from API:", error);
  }
  
  const chapter = chapters.find((c) => c.id === hadith.chapterId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/collections/${collection.id}/${book.id}`}
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Back to {book.name}
        </Link>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              {collection.name} &gt; {book.name}
              {chapter && ` > ${chapter.name}`}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Hadith {hadith.number}
            </h1>
          </div>

          <div className="flex flex-col gap-1">
            {hadith.grade && (
              <div className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded text-sm h-fit">
                {hadith.grade}
              </div>
            )}
            {hadith.grades && hadith.grades.length > 0 && (
              <div className="flex flex-col gap-1">
                {hadith.grades.map((gradeInfo, index) => (
                  <div key={index} className="bg-secondary/5 text-secondary-foreground px-3 py-1 rounded text-xs h-fit">
                    {gradeInfo.graded_by}: {gradeInfo.grade}
                  </div>
                ))}
              </div>
            )}
            {hadith.urn && (
              <div className="text-xs text-muted-foreground">
                URN: {hadith.urn}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hadith Content */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 p-6 rounded-lg border bg-card">
          {/* Chapter information if available from API */}
          {(hadith.chapterTitle || hadith.chapterNumber) && (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <div className="text-sm text-muted-foreground">
                {hadith.chapterNumber && <span>Chapter {hadith.chapterNumber}: </span>}
                {hadith.chapterTitle}
              </div>
            </div>
          )}
          
          {hadith.narrator && (
            <div className="text-primary font-medium mb-4">{hadith.narrator}</div>
          )}

          {/* Hadith text container - flex column on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* English text */}
            <div className="md:w-1/2 text-lg leading-relaxed order-1">
              <p>{hadith.text}</p>
            </div>

            {/* Arabic text */}
            <div className="arabic md:w-1/2 text-xl leading-relaxed order-2">
              <p>{hadith.textArabic}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Action buttons here... */}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t">
          {/* Navigation links here... */}
        </div>
      </div>
    </div>
  )
}

export default HadithPage;
