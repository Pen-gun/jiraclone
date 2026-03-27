import { getCurrentUser } from "@/features/action";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in")
    return ( 
    <div className="bg-neutral-500 p-1 rounded-md"> 
        Home Page
    </div>
);
}