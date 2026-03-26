"use client";

import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { showJsonToast } from "@/components/toaster";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onBoardingFormSchema } from "@/features/schemas";
import { useOnboarding } from "@/features/auth/api/use-onboarding";
import { useRouter } from "next/navigation";


export const OnBoardingCard = () => {
    const router = useRouter();
    const { mutate, isPending } = useOnboarding();

    const form = useForm<z.infer<typeof onBoardingFormSchema>>({
        resolver: zodResolver(onBoardingFormSchema),
        defaultValues: {
            fullName: "",
            age: 0,
            bio: ""
        },
    });
    const onSubmit = (data: z.infer<typeof onBoardingFormSchema>) => {
        mutate({ json: data }, {
            onSuccess: (data: any) => {
                showJsonToast("Onboarding successful!", data);
                router.push("/");
            },
            onError: (error: any) => {
                showJsonToast("Onboarding failed!", error);
            }
        });

    };
    return (
        <Card className="w-full h-full md:w-121.7 border-none shadow-none" >
            <CardHeader className="flex flex-col items-center justify-center pt-10">
                <CardTitle className="text-2xl font-bold text-center mb-4">
                    Let's get to know you better
                </CardTitle>
                <CardDescription>
                    Please fill out the following information to complete your onboarding process. This will help us personalize your experience.
                </CardDescription>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <form noValidate className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="fullName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        type="text"
                                        placeholder="Full Name"
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="age"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        type="number"
                                        placeholder="Age"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="bio"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        type="text"
                                        placeholder="Bio"
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Continuing..." : "Continue"}
                        </Button>
                    </FieldGroup>
                </form>

            </CardContent>
            <div className="px-7 mb-2">
                <DottedSeparator />
            </div>
        </Card>
    );
}