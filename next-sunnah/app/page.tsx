import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { CollectionCard } from "@/components/collection-card";
import { fetchCollections } from "@/lib/api";

export default async function Home() {
  // Fetch collections from the API and show first 4 as featured
  const { collections } = await fetchCollections(4, 1);
  const featuredCollections = collections;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-primary">Sunnah.com</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          The Hadith of the Prophet Muhammad (صلى الله عليه و سلم) at your fingertips
        </p>
        
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

      {/* About Section */}
      <section className="py-12 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">About Sunnah.com</h2>
          <p className="text-muted-foreground mb-4">
            Sunnah.com is a free resource for all Muslims and those interested in Islam to access 
            authentic hadith collections. Our mission is to provide easy access to the teachings 
            of Prophet Muhammad (صلى الله عليه و سلم).
          </p>
          <p className="text-muted-foreground">
            The collections include Sahih al-Bukhari, Sahih Muslim, Sunan an-Nasa&apos;i, and many more, 
            all available in both English and Arabic.
          </p>
        </div>
      </section>
    </div>
  );
}
