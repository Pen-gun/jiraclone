import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

export default async function SignUp() {
    const user = await getCurrentUser();
    if (user) {
        redirect("/");
    }

    return (
        <SignUpCard />
    );
}