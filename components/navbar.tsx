import Link from "next/link"
import { Menu, X } from "lucide-react"

type NavLink = {
  label: string
  to: string
}

const navLinks: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "Cart", to: "/cart" },
  { label: "Users", to: "/users" },
]


export const Navbar = () => {

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-color-gray-50/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:text-purple-600">
            <span className="hidden sm:inline">Jira Clone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground hover:cursor-pointer hover:text-purple-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}