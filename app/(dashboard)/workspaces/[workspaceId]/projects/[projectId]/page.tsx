import { redirect } from "next/navigation"
import { getCurrentUser } from "@/features/auth/queries"

interface ProjectIdPageProps {
    params: Promise<{
        workspaceId: string;
        projectId: string;
    }>;
}

const ProjectIdPage = async ({
    params,
}: ProjectIdPageProps) => {
    const { projectId } = await params;
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }
    return(
        <div>
            ProjectId: {projectId}
        </div>
    )
}
export default ProjectIdPage