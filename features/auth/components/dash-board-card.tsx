"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-seperator";
import { useLogout } from "@/features/api/use-logout";
import { useCurrent } from "@/features/api/use-current";
import { Spinner } from "@/components/spinner";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";


export const DashboardCard = () => {
	const { data: user, isLoading } = useCurrent();
	const { mutate: logout } = useLogout();
	if (isLoading) {
		return <Spinner />;
	}
	if (!user || !user.email || user.fullName === "Unknown User") {
    	redirect("/sign-in");
	}
	const { fullName, email } = user || {};
	const avatarFallback = fullName ? fullName.charAt(0).toUpperCase() : "U";
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<Avatar className="size-10 hover:opacity-75 transition border border-neutral-50">
					<AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
				<div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
					<Avatar className="size-13 border border-neutral-50">
						<AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col items-center justify-center">
					<p className="text-sm font-medium text-neutral-900">
						{fullName || "Unknown User"}
					</p>
					<p className="text-xs text-muted-foreground">
						{email || "No email provided"}
					</p>
				</div>
				<DottedSeparator className="mb-1" />
				<DropdownMenuItem className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
					onClick={() => logout()}>
					<LogOut className="size-4 mr-2" >
						Log Out
					</LogOut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>

	)

} 