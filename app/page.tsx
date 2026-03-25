import { getCurrentUser } from "@/features/action";
import { DashboardCard } from "@/features/auth/components/dash-board-card";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in")
    return ( <DashboardCard /> );
}