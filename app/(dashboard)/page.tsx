import { getCurrentUser } from "@/features/action";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in")
    return ( 
    <div> 
        This is home page
    </div>
);
}