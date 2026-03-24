"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/features/api/use-dashboard";

const DashboardCard = () => {
	const router = useRouter();
	const { data: user, isError } = useDashboard();

	useEffect(() => {
		if (isError) {
			router.push("/sign-in");
		}
	}, [isError, router]);

	if (!user) {
		return (
			<Card className="w-full h-full md:w-121.7 border-none shadow-none">
				<CardHeader className="flex flex-col items-center justify-center pt-10">
					<CardTitle className="text-2xl font-bold text-center mb-4">
						No user data available
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="w-full h-full md:w-121.7 border-none shadow-none">
			<CardHeader className="flex flex-col items-center justify-center pt-10">
				<CardTitle className="text-2xl font-bold text-center mb-4">
					Welcome back, {user.fullName || "friend"}
				</CardTitle>
				<CardDescription>
					Here's your profile information. You can edit your onboarding details anytime.
				</CardDescription>
			</CardHeader>
			<div className="px-7 mb-2">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground mb-1">Email</p>
						<p className="font-medium text-sm">{user.email}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground mb-1">Full Name</p>
						<p className="font-medium text-sm">{user.fullName || "Not set"}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground mb-1">Age</p>
						<p className="font-medium text-sm">
							{typeof user.age === "number" && user.age > 0 ? user.age : "Not set"}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground mb-1">Bio</p>
						<p className="font-medium text-sm">{user.bio || "Not set"}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground mb-1">Onboarding Status</p>
						<p className="font-medium text-sm">
							{user.onBoardingCompleted ? "✓ Completed" : "○ Pending"}
						</p>
					</div>
					<div className="flex gap-2 pt-4">
						<Button asChild variant="secondary" className="flex-1">
							<Link href="/onboarding">Edit Profile</Link>
						</Button>
						<Button asChild variant="outline" className="flex-1">
							<Link href="/sign-in">Logout</Link>
						</Button>
					</div>
				</div>
			</CardContent>
			<div className="px-7 mb-2">
				<DottedSeparator />
			</div>
		</Card>
	);
};

export default DashboardCard;
