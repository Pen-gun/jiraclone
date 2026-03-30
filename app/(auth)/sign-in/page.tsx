import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { SignInCard } from "@/features/auth/components/sign-in-card";

export default async function SignIn() {
    const user = await getCurrentUser();
    if (user) {
        redirect("/");
    }

    return ( <SignInCard /> );
}