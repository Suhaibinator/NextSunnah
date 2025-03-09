// app/collections/[collectionId]/[bookId]/[hadithId]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/data/collections";
import { getBooksByCollection } from "@/data/books";
import { getChaptersByBook } from "@/data/chapters";
import { getHadithById } from "@/data/hadiths";
import { HadithMetadata } from "@/components/hadith-metadata";

// Utility function to properly render the PBUH symbol
const formatTextWithPBUH = (text: string) => {
  // Replace the PBUH symbol with a properly styled span
  return text.replace(/\(ﷺ\)/g, '(<span class="pbuh-symbol">ﷺ</span>)');
};

interface HadithParams {
  collectionId: string;
  bookId: string;
  hadithId: string;
}

interface HadithPageProps {
  params: Promise<HadithParams | Promise<HadithParams>>;
}

export async function generateMetadata(props: HadithPageProps) {
  const params = await props.params;
  // You can just use params directly, no need for Promise.resolve
  const { collectionId, bookId, hadithId } = params;

  const collection = collections.find((c) => c.id === collectionId);
  const books = getBooksByCollection(collectionId);
  const book = books.find((b) => b.id === bookId);
  const hadith = getHadithById(hadithId);

  if (!collection || !book || !hadith) {
    return {
      title: "Hadith Not Found - Sunnah.com",
    };
  }

  return {
    title: `Hadith ${hadith.number} - ${book.name} - ${collection.name} - Sunnah.com`,
    description: hadith.text.substring(0, 160) + "...",
  };
}

const HadithPage = async (props: HadithPageProps) => {
  const params = await props.params;
  const { collectionId, bookId, hadithId } = params;

  const collection = collections.find((c) => c.id === collectionId);
  const books = getBooksByCollection(collectionId);
  const book = books.find((b) => b.id === bookId);
  const hadith = getHadithById(hadithId);

  if (!collection || !book || !hadith) {
    notFound();
  }

  const chapters = getChaptersByBook(book.id);
  const chapter = chapters.find((c) => c.id === hadith.chapterId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/collections/${collection.id}/${book.id}`}
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Back to {book.name}
        </Link>

        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">
            {collection.name} &gt; {book.name}
            {chapter && ` > ${chapter.name}`}
          </div>
          <h1 className="text-3xl font-bold mb-2">Hadith {hadith.number}</h1>
        </div>
      </div>

      {/* Hadith Content */}
      <div className="max-w-4xl md:max-w-5xl mx-auto">
        <div className="mb-8 p-6 rounded-lg border bg-card">
          {hadith.narrator && (
            <div className="text-primary font-medium mb-4">
              {hadith.narrator}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 text-lg leading-relaxed">
              <p
                dangerouslySetInnerHTML={{
                  __html: formatTextWithPBUH(hadith.text),
                }}
              />
            </div>

            <div className="flex-1 arabic text-right text-xl leading-relaxed">
              <p>{hadith.textArabic}</p>
            </div>
          </div>

          <HadithMetadata hadith={hadith} className="mt-6" />
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
  );
};

export default HadithPage;
