import { getCurrentUser } from "@/features/action";
import { redirect } from "next/navigation";
import { use } from "react";

interface WorkspaceIdSettingsPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
};

const WorkspaceIdSettingsPage = ({
    params,
 }: WorkspaceIdSettingsPageProps) => {
    const { workspaceId } = use(params);
    const user = use(getCurrentUser());
    if (!user) redirect("/sign-in");

    return(
        <div>
            Workspace Settings for {workspaceId}
        </div>
    )
}
export default WorkspaceIdSettingsPage;