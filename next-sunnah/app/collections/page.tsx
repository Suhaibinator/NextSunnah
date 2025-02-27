import { CollectionCard } from "@/components/collection-card"
import { SearchBar } from "@/components/search-bar"
import { fetchCollections } from "@/lib/api"

export const metadata = {
  title: "Collections - Sunnah.com",
  description: "Browse all hadith collections on Sunnah.com",
}

export default async function CollectionsPage() {
  // Fetch collections from the API
  const { collections } = await fetchCollections(100, 1);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hadith Collections</h1>
        <p className="text-muted-foreground mb-6">
          Browse through authentic collections of hadith compiled by renowned scholars.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <SearchBar />
        </div>
      </div>
      
      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
      
      {/* Information Section */}
      <div className="mt-12 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">About Hadith Collections</h2>
        <p className="text-muted-foreground mb-4">
          Hadith are the collected sayings, actions, and silent approvals of Prophet Muhammad (صلى الله عليه و سلم).
          These collections were meticulously compiled by scholars who dedicated their lives to preserving
          the authentic teachings of Islam.
        </p>
        <p className="text-muted-foreground">
          The most authentic collections are known as &quot;Sahih&quot; (authentic), with Sahih al-Bukhari and
          Sahih Muslim being the most highly regarded. Other important collections include the &quot;Sunan&quot;
          works of Abu Dawud, at-Tirmidhi, an-Nasa&apos;i, and Ibn Majah, which together with the two Sahih
          collections form the &quot;Six Books&quot; (Kutub al-Sittah).
        </p>
      </div>
    </div>
  )
}
