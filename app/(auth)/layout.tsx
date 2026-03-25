"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const pathname = usePathname();
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image src='/logo.svg' alt='logo' width={100} height={50} style={{ height: "auto" }} />
                    <Link href={pathname === '/sign-in' ? "/sign-up" : "/sign-in"}>
                        <Button variant="secondary" className="hover:cursor-pointer">
                            {pathname === '/sign-in' ? "Sign Up" : "Sign In"}
                        </Button>
                    </Link>
                </nav>
                <div className="flex items-center justify-center max-w-250 mx-auto mt-10">
                    {children}
                </div>
            </div>
        </main>
    )
}
export default AuthLayout;