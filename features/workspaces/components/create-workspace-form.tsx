"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import z from "zod";
import { DottedSeparator } from "@/components/dotted-seperator";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver:zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });
    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
            console.log("Form submitted with values:", values);
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

            </CardContent>
            
        </Card>

    )
}