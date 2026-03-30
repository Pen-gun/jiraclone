import { getCurrentUser } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdJoinPage = async ({
    params,
}: WorkspaceIdJoinPageProps) => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const initialValues = await getWorkspaceInfo({ workspaceId: (await params).workspaceId });
    
    if(!initialValues) {
        redirect("/");
    }

    return(
        <div className="w-full lg:max-w-4xl xl:max-w-5xl">
            <JoinWorkspaceForm initialValues={{ name: initialValues.name ?? "Unknown Workspace" }} />
        </div>
    )
}
export default WorkspaceIdJoinPage; 