"use client";

import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import { useInviteCode } from "../hooks/use-invite-code";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string;
    }
}

export const JoinWorkspaceForm = ({
    initialValues
}: JoinWorkspaceFormProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

    const onSubmit = () => {
        if (!inviteCode) {
            return;
        }

        joinWorkspace({
            param: { workspaceId },
            json: { inviteCode },
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.id}`);
            },
        });
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
                <CardDescription>
                    you&apos;ve been invited to join the workspace &quot;{initialValues.name}&quot;. Please click the button below to accept the invitation and join the workspace.
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                    <Button
                        variant="secondary"
                        type="button"
                        size="lg"
                        asChild
                        disabled={isPending}
                        className="w-full lg:w-fit">
                        <Link href="/">
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        variant="default"
                        type="submit"
                        size="lg"
                        className="w-full lg:w-fit cursor-pointer"
                        disabled={isPending || !inviteCode}
                        onClick={onSubmit}
                        >
                        Join
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}