"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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


 export const DashboardCard = () => {
	const { data: user, isLoading } = useCurrent();
	if (isLoading) {
		return <Spinner />;
	}
	const { fullName, email } = user || {};
	const avatarFallback = fullName ? fullName.charAt(0).toUpperCase() : "U";
	return (
		
	)

}