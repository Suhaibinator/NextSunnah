"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface LogoProps {
  width?: number;
  className?: string;
  colorVariable?: string;
}

export function Logo({
  width = 120,
  className = "",
  colorVariable = "--primary", // Default to primary color, but allow override
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [themeColor, setThemeColor] = useState("");

  // Only show the logo after mounting to avoid hydration mismatch
  // Also get the computed CSS variable value
  useEffect(() => {
    setMounted(true);

    // Get the CSS variable value based on the current theme
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const cssVarValue = computedStyle.getPropertyValue(colorVariable).trim();

    // Convert the CSS variable value to a hex color without the #
    const hexColor = cssVarValue.startsWith("#")
      ? cssVarValue.substring(1)
      : cssVarValue;

    setThemeColor(hexColor);
  }, [theme, colorVariable]); // Re-run when theme or colorVariable changes

  // Default fallback color (should only be used during SSR)
  const fallbackColor = "50a3a3";

  // Use the theme color or fallback if not available yet
  const color = themeColor || fallbackColor;

  // Construct the dynamic URL
  const imageUrl = `https://imgstore.org/icon/6a08zkwh789g/${color}/${
    width * 3
  }`;

  if (!mounted) {
    // Return a placeholder with the width to avoid layout shift
    return <div style={{ width }} className={className} />;
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="NextSunnah Logo"
        width={width}
        style={{ width }}
        referrerPolicy="unsafe-url"
      />
    </div>
  );
}
