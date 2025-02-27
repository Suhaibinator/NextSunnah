"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ 
  showText = false, 
  className = "p-2" 
}: { 
  showText?: boolean,
  className?: string 
}) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`rounded-md ${className} focus:outline-none focus:ring-2 focus:ring-primary`}
      aria-label="Toggle theme"
    >
      {/* Only render one icon based on current theme */}
      <div className="flex items-center">
        {showText && (
          <span className="mr-2">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        )}
        {mounted && (theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        ))}

        {!showText && <span className="sr-only">Toggle theme</span>}
      </div>
    </button>
  )
}
