import Link from "next/link";
import { collections } from "@/data/collections";
import { SearchBar } from "@/components/search-bar";
import { CollectionCard } from "@/components/collection-card";
import { Logo } from "@/components/logo";

export default function Home() {
  // Featured collections (showing first 4)
  const featuredCollections = collections.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="flex justify-center mb-8">
          <Logo width={1024} className="mx-auto" />
        </div>
        <h1 className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          The Hadith of the Prophet Muhammad <span className="arabic">(صلى الله عليه و سلم)</span> at your fingertips
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar />
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link 
            href="/collections" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
          >
            Browse Collections
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Collections</h2>
          <Link 
            href="/collections" 
            className="text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
}
