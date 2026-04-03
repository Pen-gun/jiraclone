"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspace";
import { RiAddCircleFill } from "react-icons/ri";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";



export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const { data } = useGetWorkspaces();
    const workspaceid = useWorkspaceId();
    const {openModal} = useCreateWorkspaceModal();
    const onSelect = (id: string) => {
        
        router.push(`/workspaces/${id}`);
    }
    return (
        <div className="flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                    Workspaces
                </p>
                <RiAddCircleFill className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={openModal} />
            </div>
            <Select onValueChange={onSelect} value={workspaceid}>
                <SelectTrigger size="sm" className="w-full bg-neutral-200 font-medium px-2 rounded-md">
                    <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                    {data?.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                            <div className="flex justify-start items-center gap-2 font-medium">
                                <WorkspaceAvatar name={workspace.name} />
                                <span className="truncate text-sm">{workspace.name}</span>
                            </div>
                        </SelectItem>
                    ))}

                </SelectContent>
            </Select>
        </div>
    )
}