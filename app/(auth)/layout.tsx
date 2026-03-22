import { Button } from "@/components/ui/button";
import Image from "next/image";
interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image src='/logo.svg' alt='logo' width={100} height={50} />
                    <Button variant="secondary">Sign up</Button> 
                </nav>
                <div className="flex items-center justify-center max-w-250 mx-auto mt-10">
                    {children}
                </div>
            </div>
        </main>
    )
}
export default AuthLayout;