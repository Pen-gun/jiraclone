"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";

const route =[
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill

    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: " Members ",
        href: "/members",
        icon: UserIcon,
        activeIcon: UserIcon
    }
];

export const Navigation = () => {
    const workspaceId = useWorkspaceId();
    const pathname = usePathname();

    const getWorkspaceHref = (href: string) => {
        return `/workspaces/${workspaceId}${href}`;
    };

    return (
        <ul className="flex flex-col gap-y-1">
            {route.map((item) => {
                const fullHref = getWorkspaceHref(item.href);
                const isActive = pathname === fullHref;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                    <Link key={item.href} href={fullHref}>
                        <div
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-md font-medium text-sm hover:text-primary transition text-neutral-500",
                                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                            )}
                        >
                            <Icon className="size-4.5 mr-1.5" />
                            {item.label}
                        </div>
                    </Link>
                );
            })}
        </ul>
    );
};