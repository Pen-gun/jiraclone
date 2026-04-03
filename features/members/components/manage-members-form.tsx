"use client";

import { useState } from "react";

import { DottedSeparator } from "@/components/dotted-seperator";
import { showJsonToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteMember } from "../api/use-delete-member";
import { useGetMembers } from "../api/use-get-members";
import { useUpdateMember } from "../api/use-update-method";
import { MemberRole } from "../types";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type MemberRoleValue = MemberRole;


export const ManageMembersForm = ({ workspaceId }: { workspaceId: string }) => {
    const router = useRouter();
    const { data, isLoading, isError, error } = useGetMembers({ workspaceId });
    const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
    const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
    const [selectedRoles, setSelectedRoles] = useState<Record<string, MemberRoleValue>>({});

    const members = data?.data.member ?? [];


    const [DeleteConfirmationDialog, confirmDelete] = useConfirm(
        "Remove Member",
        "Are you sure you want to remove this member from the workspace?",
        "destructive"
    );

    const handleRoleChange = (memberId: string, role: MemberRoleValue) => {
        setSelectedRoles((prev) => ({ ...prev, [memberId]: role }));
    };

    const handleUpdateRole = (memberId: string, nextRole: MemberRoleValue, currentRole: string) => {
        if (nextRole === currentRole) {
            return;
        }

        updateMember(
            {
                param: { memberId },
                query: { workspaceId },
                json: { role: nextRole },
            },
            {
                onSuccess: () => {
                    showJsonToast("Member role updated", { memberId, role: nextRole });
                },
                onError: (updateError) => {
                    showJsonToast("Failed to update member role", {
                        error: updateError.message,
                        memberId,
                    });
                },
            }
        );
    };

    const handleDeleteMember = async (memberId: string) => {
        const ok = await confirmDelete();
        if (!ok) {
            return;
        }

        deleteMember(
            {
                param: { memberId },
                query: { workspaceId },
            },
            {
                onSuccess: () => {
                    showJsonToast("Member removed", { memberId });
                },
                onError: (deleteError) => {
                    showJsonToast("Failed to remove member", {
                        error: deleteError.message,
                        memberId,
                    });
                },
            }
        );
    };


    return (
        <div>
            <DeleteConfirmationDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex p-7">
                    <Button size='sm' variant='secondary' onClick={() => router.back()} className="mr-3 cursor-pointer">
                        <ArrowLeftIcon className="size-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-xl font-bold">Manage Members</CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    {isLoading && <p className="text-sm text-muted-foreground">Loading members...</p>}

                    {isError && (
                        <p className="text-sm text-destructive">
                            {error instanceof Error ? error.message : "Failed to fetch members"}
                        </p>
                    )}

                    {!isLoading && !isError && members.length === 0 && (
                        <p className="text-sm text-muted-foreground">No members found for this workspace.</p>
                    )}

                    {!isLoading && !isError && members.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => {
                                    const selectedRole = selectedRoles[member.id] ?? member.role;
                                    const isAdminMember = member.role === MemberRole.ADMIN;

                                    return (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">
                                                {member.fullName ?? member.email ?? member.userId}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                                                    {member.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Select
                                                        value={selectedRole}
                                                        onValueChange={(value) =>
                                                            handleRoleChange(member.id, value as MemberRoleValue)
                                                        }
                                                        disabled={isUpdating || isDeleting || isAdminMember}
                                                    >
                                                        <SelectTrigger className="w-36">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={MemberRole.MEMBER}>MEMBER</SelectItem>
                                                            <SelectItem value={MemberRole.ADMIN}>ADMIN</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        disabled={
                                                            isUpdating ||
                                                            isDeleting ||
                                                            isAdminMember ||
                                                            selectedRole === member.role
                                                        }
                                                        onClick={() =>
                                                            handleUpdateRole(member.id, selectedRole, member.role)
                                                        }
                                                    >
                                                        {isUpdating ? "Saving..." : "Save"}
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        disabled={isUpdating || isDeleting || isAdminMember}
                                                        onClick={() => handleDeleteMember(member.id)}
                                                    >
                                                        {isDeleting ? "Removing..." : "Remove"}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};