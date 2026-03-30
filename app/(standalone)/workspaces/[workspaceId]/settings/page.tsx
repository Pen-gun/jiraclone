import { getCurrentUser } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
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

  const [user, workspace] = await Promise.all([
    getCurrentUser(),
    getWorkspace({ workspaceId }),
  ]);

  if (!user) redirect("/sign-in");

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
    <div className="w-full lg:max-w-4xl xl:max-w-5xl">
      <EditWorkspaceForm initialWorkspace={workspace} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;