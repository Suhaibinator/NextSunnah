"use client"

import { useState } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  size?: "default" | "compact"
}

export function SearchBar({ size = "default" }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would redirect to search results
    console.log("Search query:", query)
  }

  const isCompact = size === "compact"
  
  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-2 top-1/2 ${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} -translate-y-1/2 text-primary`} />
        <input
          type="text"
          placeholder={isCompact ? "Search hadith..." : "Search ..."}
          className={`w-full rounded-md border ${isCompact ? 'border-primary/30 bg-background py-1.5' : 'border-primary/20 bg-card py-3'} ${isCompact ? 'pl-8' : 'pl-10'} pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-primary ${isCompact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'} font-medium text-primary-foreground`}
      >
        Search
      </button>
    </form>
  )
}
