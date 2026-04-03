"use client"

import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri"
import { cn } from "@/lib/utils";

export const Projects = () => {
    const projectId = null // todo: get project id from url

    const workspaceId = useWorkspaceId();
    const pathname = usePathname();
    const { data: projects } = useGetProjects({ workspaceId });

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">
                    Projects
                </p>
                <RiAddCircleFill
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
                    onClick={() => { }}
                />
            </div>

            {projects?.map((project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.id}`;
                const isActive = pathname === href;

                return (
                    <Link
                        key={project.id}
                        href={href}
                    >
                        <div className={cn("px-2 py-1 rounded-md text-sm hover:bg-neutral-100 transition cursor-pointer", isActive && "bg-neutral-100")}>
                            {project.name}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}