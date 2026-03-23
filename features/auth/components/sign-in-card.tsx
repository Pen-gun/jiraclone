"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
 } from "@/components/ui/card";
import {Input} from "@/components/ui/input";

import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signInFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters long"),
});
export const SignInCard = () => {
    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
        console.log("Submitted data:", data);
    };
    return (
        <Card className="w-full h-full md:w-121.7 border-none shadow-none" >
            <CardHeader className="flex items-center justify-center pt-10">
                <CardTitle className="text-2xl font-bold text-center mb-4">
                    Welcome my friend
                </CardTitle>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <form noValidate className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field,fieldState }) => (
                            <div data-invalid={fieldState.invalid}>
                                <Input
                                    id='semail'
                                    type="email"
                                    placeholder="Email"
                                    {...field}
                                    arial-invalid={fieldState.invalid}
                                    autoComplete="email"
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field,fieldState }) => (
                            <div data-invalid={fieldState.invalid}>
                                <Input
                                    id='spassword'
                                    type="password"
                                    placeholder="Password"
                                    {...field}
                                    arial-invalid={fieldState.invalid}
                                    autoComplete="current-password"
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />      
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                </form>
                
            </CardContent>
            <div className="px-7 mb-2">
                    <DottedSeparator />
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
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
            </CardContent>
        </Card>
    );
}