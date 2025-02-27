import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        
        <p className="text-xl mb-8 text-muted-foreground">
          The hadith or page you are looking for could not be found.
        </p>
        
        {/* Arabic quote about seeking knowledge */}
        <div className="my-8 p-6 bg-card rounded-lg shadow-sm">
          <p className="text-muted-foreground italic">
            &quot;Seeking knowledge is an obligation upon every Muslim.&quot;
          </p>
          <hr className="my-2" />
          <p className="arabic text-xl mb-4 text-center">
            طلب العلم فريضة على كل مسلم
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto my-8">
          <p className="mb-4 text-muted-foreground">
            Perhaps you can find what you&apos;re looking for with a search:
          </p>
          <SearchBar />
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Link 
            href="/" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
          >
            Return to Home
          </Link>
          <Link 
            href="/collections" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
