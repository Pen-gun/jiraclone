"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { showJsonToast } from "@/components/toaster";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
 } from "@/components/ui/card";
 import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input";

import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from 'next/link'
import { signInFormSchema } from "@/features/schemas";
import { useLogin } from "@/features/api/use-login";


export const SignInCard = () => {
    const {mutate} = useLogin();

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
        mutate({ json: data });
        showJsonToast("Sign in successful!", data);
       
    };
    return (
        <Card className="w-full h-full md:w-121.7 border-none shadow-none" >
            <CardHeader className="flex flex-col items-center justify-center pt-10">
                <CardTitle className="text-2xl font-bold text-center mb-4">
                    Welcome my friend
                </CardTitle>
                <CardDescription>
                    Read out{" "}
                    <Link href="/terms">
                        <span className="text-blue-500 hover:underline">Terms of Service</span>
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy">
                        <span className="text-blue-500 hover:underline">Privacy Policy.</span>
                    </Link>  
                </CardDescription>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <form noValidate className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field,fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="email"
                                />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field,fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="current-password"
                                />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />      
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                    </FieldGroup>
                </form>
              
                
            </CardContent>
            <div className="px-7 mb-2">
                    <DottedSeparator />
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Field>
                    <Button
                        disabled={false}
                        variant="secondary"
                        size='lg'
                        className="w-full"
                        >
                        <FcGoogle className="mr-2" />
                        Login with Google
                    </Button>
                    <Button
                        disabled={false}
                        variant="secondary"
                        size='lg'
                        className="w-full"
                        >
                        <FaGithub className="mr-2" />
                        Login with Github
                    </Button>
                </Field>
            </CardContent>
        </Card>
    );
}