import { DashboardCard } from "@/features/auth/components/dash-board-card"
import Link from "next/link"
import { MobileSidebar } from "./mobile-sidebar"

type NavLink = {
    label: string
    to: string
}

const navLinks: NavLink[] = [
    { label: "Home", to: "/" }
]

export const Navbar = () => {
    return (
        <nav className="pt-4 px-6 flex items-center justify-between w-full">
                <div className="flex-col hidden lg:flex">
                    {/* Desktop Navigation */}
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            href={link.to}
                            className="rounded-md font-medium "
                        >
                            {link.label}
                        </Link>
                    ))}
                    <p className="text-muted-foreground text-sm">
                        Welcome to Home
                    </p>
                </div>
                <MobileSidebar />
                <DashboardCard />
        </nav>
    )
}