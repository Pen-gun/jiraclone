import { getCurrentUser } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");
    if(user.onBoardingCompleted === false) redirect("/onboarding");

    const workspacesresponse = await getWorkspaces();
    if (workspacesresponse.workspaces.length === 0) {
        redirect("/workspaces/create");
    } else {
        redirect(`/workspaces/${workspacesresponse.workspaces[0].id}`);
    }
}