"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { z } from "zod";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { showJsonToast } from "@/components/toaster";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialWorkspace: Workspace;
};

export const EditWorkspaceForm = ({ onCancel, initialWorkspace }: EditWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspace();
    const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();
    const [DeleteConfirmationDialog, confirmDelete] = useConfirm(
        "Confirm Deletion",
        "Are you sure you want to delete this workspace? This action cannot be undone.",
        "destructive"
    );

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialWorkspace,
        }
    });
    const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
        mutate({
            form: values,
            param: { workspaceId: initialWorkspace.id }

        }, {
            onSuccess: ({ data }) => {
                showJsonToast("Workspace updated successfully", { name: values.name });
                form.reset();
                router.push(`/workspaces/${data.id}`); // Navigate to the workspace page
            },
            onError: (error: any) => {
                const message = error instanceof Error ? error.message : "An unknown error occurred";
                alert(`Failed to update workspace: ${message}`);
            }
        });

    };
    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;

        deleteWorkspace(
            { param: { workspaceId: initialWorkspace.id } },
            {
                onSuccess: () => {
                    showJsonToast("Workspace deleted successfully", {
                        name: initialWorkspace.name,
                    });
                    router.push("/");
                },
                onError: (error) => {
                    showJsonToast("Failed to delete workspace", {
                        error: error.message,
                    });
                },
            }
        );
    };
    return (
        <div className="flex flex-col gap-y-4">
            <DeleteConfirmationDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-centergap-x-4 p-7 space-y-0">
                    <Button size='sm' variant='secondary' onClick={onCancel ? onCancel : () => router.back()} className="mr-3 cursor-pointer">
                        <ArrowLeftIcon className="size-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-xl font-bold">
                        {initialWorkspace.name}
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            Workspace Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter workspace name"
                                            autoComplete="off"
                                        />
                                        {fieldState.error && (
                                            <FieldError>
                                                {fieldState.error.message}
                                            </FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <DottedSeparator className="my-6" />
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isPending || isDeleting}
                                className={cn(!onCancel && "invisible")}>
                                Cancel
                            </Button>
                            <Button type="submit" className="mr-3 cursor-pointer" disabled={isPending || isDeleting}>
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>

            </Card>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">
                            Deleting a workspace is a permanent action and cannot be undone.
                        </p>
                        <Button 
                        type="button"
                        size='sm'
                        className="mt-6 w-fit ml-auto cursor-pointer"
                        variant="destructive"
                        disabled={isPending || isDeleting}
                        onClick={handleDelete}
                        >
                            {isDeleting ? "Deleting..." : "Delete Workspace"}
                        </Button>
                    </div>
                </CardContent>

            </Card>
        </div>

    )
}