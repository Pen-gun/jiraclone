import Link from "next/link"

type NavLink = {
  label: string
  to: string
}

const navLinks: NavLink[] = [
  { label: "Home", to: "/" }
]

export const Navbar = () => {
  return (
    <nav className="top-0 left-0 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 bg-color-gray-50/95">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground hover:cursor-pointer"
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