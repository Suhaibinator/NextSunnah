import React from "react";
import { render, screen, fireEvent, act, within } from "@/test-utils";
import { Header } from "@/components/layout/header";
import { usePathname } from "next/navigation";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock window.scrollY and scroll event
const mockScrollY = jest.fn();
Object.defineProperty(window, "scrollY", {
  get: () => mockScrollY(),
});

// Mock the SearchBar component
jest.mock("@/components/search-bar", () => ({
  SearchBar: ({ size }: { size?: string }) => (
    <div data-testid="search-bar" data-size={size}>
      Search Bar
    </div>
  ),
}));

// Mock the ThemeToggle component
jest.mock("@/components/ui/theme-toggle", () => ({
  ThemeToggle: ({
    showText,
    className,
  }: {
    showText?: boolean;
    className?: string;
  }) => (
    <button
      aria-label="Toggle theme"
      data-testid="theme-toggle"
      data-show-text={showText ? "true" : "false"}
      className={className}
    >
      Toggle Theme
    </button>
  ),
}));

describe("Header component", () => {
  beforeEach(() => {
    // Default to homepage
    (usePathname as jest.Mock).mockReturnValue("/");
    // Reset mock for scrollY
    mockScrollY.mockReturnValue(0);
    // Reset any event listeners
    jest.clearAllMocks();
  });

  test("renders the logo link", () => {
    render(<Header />);

    // Check if the logo link is rendered
    const logoLink = screen.getByRole("link", { name: /NextSunnah Logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  test("renders the theme toggle", () => {
    render(<Header />);

    // Check if the theme toggle button is rendered
    const themeToggleButton = screen.getByTestId("theme-toggle");
    expect(themeToggleButton).toBeInTheDocument();
  });

  test("does not render search bar on homepage", () => {
    // Mock pathname to be homepage
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<Header />);

    // Check that search bar is not rendered
    expect(screen.queryByTestId("search-bar")).not.toBeInTheDocument();
  });

  test("renders search bar on non-homepage routes", () => {
    // Mock pathname to be a non-homepage route
    (usePathname as jest.Mock).mockReturnValue("/collections");

    render(<Header />);

    // Check that search bars are rendered with compact size
    const searchBars = screen.getAllByTestId("search-bar");
    // Should have two search bars - one for desktop header and one for mobile second row
    expect(searchBars.length).toBe(2);

    // Both should have compact size
    searchBars.forEach((searchBar) => {
      expect(searchBar).toHaveAttribute("data-size", "compact");
    });
  });

  test("toggles mobile menu when menu button is clicked", () => {
    render(<Header />);

    // Initially, mobile menu should not be visible
    expect(
      screen.queryByRole("button", { name: /close menu/i })
    ).not.toBeInTheDocument();

    // Find and click the menu button
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // The button should now be a close button
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toBeInTheDocument();

    // Mobile menu should be visible - check for the close button
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
  });

  test("renders search bar in second row for mobile on non-homepage routes", () => {
    // Mock pathname to be a non-homepage route
    (usePathname as jest.Mock).mockReturnValue("/collections");

    render(<Header />);

    // Find the mobile search bar row
    const searchBars = screen.getAllByTestId("search-bar");
    expect(searchBars.length).toBe(2);

    // The second search bar should be in the mobile row
    const mobileSearchBar = searchBars[1];

    // Find the container div with the md:hidden class
    const mobileRow = screen
      .getByText("Search Bar", {
        selector: 'div.md\\:hidden div[data-testid="search-bar"]',
      })
      .closest("div.md\\:hidden");

    expect(mobileRow).toBeInTheDocument();
    expect(mobileRow).toHaveClass("md:hidden");
    expect(mobileRow).toHaveClass("border-t");
  });

  test("mobile menu contains theme toggle", () => {
    // Mock pathname to be a non-homepage route
    (usePathname as jest.Mock).mockReturnValue("/collections");

    render(<Header />);

    // Open the mobile menu
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // Check that the theme toggle is in the mobile menu
    const themeToggleInMobileMenu = screen.getAllByTestId("theme-toggle").find(
      toggle => toggle.getAttribute("data-show-text") === "true"
    );
    
    expect(themeToggleInMobileMenu).toBeInTheDocument();
  });

  test("renders subheader with correct links", () => {
    render(<Header />);

    // Get the subheader container first
    const subheaderContainer = screen.getByText(/qur'an/i).closest("nav");
    expect(subheaderContainer).not.toBeNull();

    if (subheaderContainer) {
      // Check if the subheader links are rendered within the subheader container
      const quranLink = within(subheaderContainer).getByText(/qur'an/i);
      expect(quranLink).toBeInTheDocument();
      expect(quranLink).toHaveAttribute("href", "https://quran.com/");

      const sunnahLink = within(subheaderContainer).getByText(/sunnah/i);
      expect(sunnahLink).toBeInTheDocument();
      expect(sunnahLink).toHaveAttribute("href", "/");
      expect(sunnahLink).toHaveClass("font-bold");

      const prayerTimesLink =
        within(subheaderContainer).getByText(/prayer times/i);
      expect(prayerTimesLink).toBeInTheDocument();
      expect(prayerTimesLink).toHaveAttribute("href", "https://salah.com/");

      const audioLink = within(subheaderContainer).getByText(/audio/i);
      expect(audioLink).toBeInTheDocument();
      expect(audioLink).toHaveAttribute("href", "https://quranicaudio.com/");
    }
  });

  test("hides subheader when scrolling down and shows when scrolling to top", () => {
    render(<Header />);

    // Get the subheader div (the one with the transition classes)
    const quranElement = screen.getByText(/qur'an/i);
    const containerDiv = quranElement.closest("div");
    expect(containerDiv).not.toBeNull();

    if (containerDiv && containerDiv.parentElement) {
      const subheader = containerDiv.parentElement;

      // Initially, subheader should be visible
      expect(subheader).toHaveClass("h-8");
      expect(subheader).toHaveClass("opacity-100");
      expect(subheader).not.toHaveClass("opacity-0");

      // Simulate scrolling down
      mockScrollY.mockReturnValue(100);
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });

      // Subheader should now be hidden
      expect(subheader).toHaveClass("h-0");
      expect(subheader).toHaveClass("opacity-0");
      expect(subheader).not.toHaveClass("opacity-100");

      // Simulate scrolling back to top (scrollY = 0)
      mockScrollY.mockReturnValue(0);
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });

      // Subheader should be visible again
      expect(subheader).toHaveClass("h-8");
      expect(subheader).toHaveClass("opacity-100");
      expect(subheader).not.toHaveClass("opacity-0");
    }
  });
});
