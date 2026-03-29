import { getCurrentUser } from "@/features/action";
import { getWorkspace } from "@/features/workspaces/action";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const { workspaceId } = await params;

  // Parallel fetching for better performance
  const [user, workspace] = await Promise.all([
    getCurrentUser(),
    getWorkspace({ workspaceId }),
  ]);

  // Check authentication
  if (!user) redirect("/sign-in");

  // Check if workspace exists
  if (!workspace) redirect("/");

  // Authorization: only owner or admin can edit
  const isOwner = workspace.ownerId === user.id;
  const isAdmin = workspace.members?.some(
    (member) => member.userId === user.id && member.role === "ADMIN"
  ) ?? false;

  if (!isOwner && !isAdmin) {
    redirect("/");
  }

  return (
    <div>
      <EditWorkspaceForm initialWorkspace={workspace} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;