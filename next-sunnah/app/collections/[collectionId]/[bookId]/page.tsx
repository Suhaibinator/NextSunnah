import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/data/collections";
import { getBooksByCollection } from "@/data/books";
import { getChaptersByBook } from "@/data/chapters";
import { getHadithsByChapter } from "@/data/hadiths";
import { SearchBar } from "@/components/search-bar";
import { HadithMetadata } from "@/components/hadith-metadata";

// Utility function to properly render the PBUH symbol
const formatTextWithPBUH = (text: string) => {
  // Replace the PBUH symbol with a properly styled span
  return text.replace(/\(ﷺ\)/g, '(<span class="pbuh-symbol">ﷺ</span>)');
};

interface BookPageProps {
  params: Promise<{
    collectionId: string;
    bookId: string;
  }>;
}

export async function generateMetadata(props: BookPageProps) {
  const params = await props.params;
  const collection = collections.find((c) => c.id === params.collectionId);
  const books = getBooksByCollection(params.collectionId);
  const book = books.find((b) => b.id === params.bookId);

  if (!collection || !book) {
    return {
      title: "Book Not Found - Sunnah.com",
    };
  }

  return {
    title: `${book.name} - ${collection.name} - Sunnah.com`,
    description: `${book.name} from ${collection.name} containing ${book.hadithCount} hadiths.`,
  };
}

export default async function BookPage(props: BookPageProps) {
  const params = await props.params;
  const collection = collections.find((c) => c.id === params.collectionId);
  const books = getBooksByCollection(params.collectionId);
  const book = books.find((b) => b.id === params.bookId);

  if (!collection || !book) {
    notFound();
  }

  const chapters = getChaptersByBook(book.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/collections/${collection.id}`}
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Back to {collection.name}
        </Link>

        <div className="text-sm text-muted-foreground mb-1">
          {collection.name}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-0">
            {book.number}. {book.name}
          </h1>

          {/* Desktop view: Arabic text with metadata below */}
          <div className="hidden md:flex flex-col items-end">
            <p className="arabic text-2xl font-medium">{book.nameArabic}</p>
            <div className="text-sm text-muted-foreground mt-2 text-right">
              <div>
                {book.hadithCount} Hadiths • {book.chapterCount} Chapters
              </div>
            </div>
          </div>

          {/* Mobile view: Metadata and Arabic on same line */}
          <div className="flex md:hidden justify-between items-center w-full mt-2">
            <div className="text-sm text-muted-foreground">
              <div>{book.hadithCount} Hadiths</div>
              <div>{book.chapterCount} Chapters</div>
            </div>
            <p className="arabic text-2xl font-medium">{book.nameArabic}</p>
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
          const hadiths = getHadithsByChapter(chapter.id);

          return (
            <div key={chapter.id} className="border-t pt-8">
              <div className="mb-6">
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4">
                  <h2 className="text-xl font-bold mb-2 md:mb-0">
                    Chapter {chapter.number}: {chapter.name}
                  </h2>
                  <p className="arabic text-lg text-right">
                    {chapter.nameArabic}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {hadiths.map((hadith) => (
                  <Link
                    key={hadith.id}
                    href={`/collections/${collection.id}/${book.id}/${hadith.id}`}
                    className="block"
                  >
                    <div className="p-6 rounded-lg border bg-card hover:border-primary transition-colors">
                      <div className="mb-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                          Hadith {hadith.number}
                        </span>
                      </div>

                      {hadith.narrator && (
                        <div className="text-primary font-medium mb-4">
                          {hadith.narrator}
                        </div>
                      )}

                      <div className="mb-4">
                        <p
                          className="line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: formatTextWithPBUH(hadith.text),
                          }}
                        />
                      </div>

                      <div className="arabic text-right mb-4">
                        <p className="line-clamp-3">{hadith.textArabic}</p>
                      </div>

                      <HadithMetadata hadith={hadith} />
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
          );
        })}

        {chapters.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No chapters available for this book.
          </div>
        )}
      </div>
    </div>
  );
}
