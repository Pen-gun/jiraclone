import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/components/navigation";

export const Sidebar = () => {
    return(
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href='/' >
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </Link>
            {navigation()}
        </aside>
    )
}