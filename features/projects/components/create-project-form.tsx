"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createProjectSchema } from "../schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "../api/use-create-project";
import { showJsonToast } from "@/components/toaster";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
    onCancel?: () => void;
};

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
    const workspaceId = useWorkspaceId();
    const { mutate, isPending} = useCreateProject();
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver:zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            description: "",
            workspaceId,
        }   
    });
    const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
        mutate({ form: values },{
            onSuccess: () => {
                showJsonToast("Project created successfully", { name: values.name });
                form.reset();
                onCancel?.();
            },
            onError: (error: any) => {
                const message = error instanceof Error ? error.message : "An unknown error occurred";
                alert(`Failed to create project: ${message}`);
            }
        });

    };  
    return(
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new project
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
                                        Project Name
                                    </FieldLabel>
                                    <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter project name"
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
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid = {fieldState.invalid}>
                                    <FieldLabel>
                                        Description
                                    </FieldLabel>
                                    <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Add an optional project description"
                                    rows={4}
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
                            {isPending ? "Creating..." : "Create Project"}
                        </Button>
                    </div>
                </form>
            </CardContent>
            
        </Card>

    )
}