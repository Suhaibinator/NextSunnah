import Link from "next/link"
import { Collection } from "@/types"
import { cn } from "@/lib/utils"

interface CollectionCardProps {
  collection: Collection
  className?: string
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <div className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-6 text-card-foreground shadow transition-all hover:shadow-md",
        className
      )}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{collection.name}</h3>
        </div>
        
        <div className="mb-4">
          <p className="arabic text-xl font-medium">{collection.nameArabic}</p>
        </div>
        
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {collection.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{collection.bookCount} Books</span>
            <span>•</span>
            <span>{collection.hadithCount} Hadiths</span>
          </div>
          <div className="text-primary group-hover:underline">View Collection</div>
        </div>
      </div>
    </Link>
  )
}
