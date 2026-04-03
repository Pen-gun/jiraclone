"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { DottedSeparator } from "./dotted-seperator";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
    return(
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href='/' >
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </Link>
            <DottedSeparator className="my-4" />
            <WorkspaceSwitcher />
            <DottedSeparator className="my-4" />
            <Navigation />
            <DottedSeparator className="my-4" />
            <Projects />
        </aside>
    )
}