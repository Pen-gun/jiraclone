import { getCurrentUser } from "@/features/auth/queries";
import { ManageMembersForm } from "@/features/members/components/manage-members-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdMembersPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdMembersPage = async ({
  params,
}: WorkspaceIdMembersPageProps) => {
  const { workspaceId } = await params;

  const [user, workspace] = await Promise.all([
    getCurrentUser(),
    getWorkspace({ workspaceId }),
  ]);

  if (!user) redirect("/sign-in");

  if (!workspace) redirect("/");

  const isOwner = workspace.ownerId === user.id;
  const isAdmin =
    workspace.members?.some(
      (member) => member.userId === user.id && member.role === "ADMIN"
    ) ?? false;

  if (!isOwner && !isAdmin) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-4xl xl:max-w-5xl">
      <ManageMembersForm workspaceId={workspaceId} />
    </div>
  );
};

export default WorkspaceIdMembersPage;
