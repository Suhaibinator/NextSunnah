"use client"

import { useState } from "react"
import { Search, Filter, HelpCircle } from "lucide-react"

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
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <button
          type="submit"
          className={`rounded-md bg-primary ${isCompact ? 'p-1' : 'p-1.5'} flex items-center justify-center text-primary-foreground`}
          aria-label="Search"
        >
          <Search className={`${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        </button>
        
        <button
          type="button"
          className={`rounded-md border border-primary/20 ${isCompact ? 'px-2 py-0.5' : 'px-3 py-1'} text-xs font-medium flex items-center gap-1`}
          onClick={() => console.log("Filter clicked")}
        >
          <Filter className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className="hidden md:inline">Filter</span>
        </button>
        
        <button
          type="button"
          className={`rounded-md border border-primary/20 ${isCompact ? 'px-2 py-0.5' : 'px-3 py-1'} text-xs font-medium flex items-center gap-1`}
          onClick={() => console.log("Tips clicked")}
        >
          <HelpCircle className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className="hidden md:inline">Tips</span>
        </button>
      </div>
    </form>
  )
}
