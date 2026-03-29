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
import { showJsonToast } from "@/components/toaster";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialWorkspace: Workspace;
};

export const EditWorkspaceForm = ({ onCancel, initialWorkspace }: EditWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending} = useUpdateWorkspace();
    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver:zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialWorkspace,
        }
    });
    const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
        mutate({ 
            form: values,
            param: { workspaceId: initialWorkspace.id }

         },{
            onSuccess: ({data}) => {
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
    return(
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
                                <Field data-invalid = {fieldState.invalid}>
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
                        disabled = {isPending}
                        className={cn(!onCancel && "invisible")}>
                            Cancel
                        </Button>
                        <Button type="submit" className="mr-3" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
            
        </Card>

    )
}