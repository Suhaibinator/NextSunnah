"use client"

import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center gap-4 md:h-16 md:flex-row md:justify-center">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Sunnah.com. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
