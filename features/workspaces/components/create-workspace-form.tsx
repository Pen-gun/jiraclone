"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas";
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
import { useCreateWorkspace } from "../api/use-create-workspace";
import { showJsonToast } from "@/components/toaster";
import { useRouter } from "next/navigation";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending} = useCreateWorkspace();
    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver:zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
        }
    });
    const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {
        mutate({ json: values },{
            onSuccess: (workspace) => {
                showJsonToast("Workspace created successfully", { name: values.name });
                form.reset();
                router.push(`/workspaces/${workspace.id}`); // Navigate to the new workspace page

            },
            onError: (error: any) => {
                const message = error instanceof Error ? error.message : "An unknown error occurred";
                alert(`Failed to create workspace: ${message}`);
            }
        });

    };  
    return(
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new workspace
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
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="mr-3" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Workspace"}
                        </Button>
                    </div>
                </form>
            </CardContent>
            
        </Card>

    )
}