import { getCurrentUser } from "@/features/action";
import { getWorkspaces } from "@/features/workspaces/action";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const workspacesresponse = await getWorkspaces();
    if (workspacesresponse.workspaces.length === 0) {
        redirect("/workspaces/create");
    } else {
        redirect(`/workspaces/${workspacesresponse.workspaces[0].id}`);
    }
}