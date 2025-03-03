"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SearchBar } from "@/components/search-bar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 pl-0 md:pl-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1 text-sm leading-none">
              <span className="text-xl font-bold tracking-wide text-primary">SUNNAH.COM</span>
              <span className="text-xs text-muted-foreground">The Hadith of the Prophet Muhammad (صلى الله عليه و سلم) at your fingertips</span>
            </div>
          </Link>
        </div>

        {/* Header Search Bar (hidden on homepage) */}
        {pathname !== "/" && (
          <div className="hidden md:block w-1/3 mx-4">
            <SearchBar size="compact" />
          </div>
        )}

        {/* Mobile menu button */}
        <button
          className="block md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 pr-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top md:hidden bg-background">
            <div className="relative z-20 grid gap-6 p-4 rounded-md">
              {/* Mobile Search Bar (hidden on homepage) */}
              {pathname !== "/" && (
                <div className="mb-4">
                  <SearchBar size="compact" />
                </div>
              )}
              <nav className="grid grid-flow-row auto-rows-max text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex w-full items-center rounded-md p-2 text-sm font-medium ${
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className={`flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground`}>
                  <ThemeToggle showText={true} className="p-0" />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
