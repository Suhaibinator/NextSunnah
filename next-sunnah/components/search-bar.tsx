"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would redirect to search results
    console.log("Search query:", query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search hadith by keyword, reference number, or topic..."
          className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
      >
        Search
      </button>
    </form>
  )
}
