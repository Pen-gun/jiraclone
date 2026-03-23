"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
 } from "@/components/ui/card";
 import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import Link from "next/link";

import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signUpFormSchema = z.object({
    email: z.email(),
    password: z.string()
    .min(6)
    .max(100),
    confirmPassword: z.string()
    .min(6)
    .max(100),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const SignUpCard = () => {
    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })
    const onsubmit = (data: z.infer<typeof signUpFormSchema>)=>{
        console.log("submitted data:", data)
    }
    return (
        <Card className="w-full h-full md:w-121.7 border-none shadow-none" >
            <CardHeader className="flex flex-col items-center justify-center pt-10">
                <CardTitle className="text-2xl font-bold text-center">
                    Hello my new friend
                </CardTitle>
                <CardDescription>
                    By signing up, you agree to our{" "}
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
                    <form noValidate className="space-y-4" onSubmit={form.handleSubmit(onsubmit)}>
                        <FieldGroup>
                        <Controller
                            name='email'
                            control={form.control}
                            render={({field,fieldState})=>(
                                <Field data-invalid = {fieldState.invalid}>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Email"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="email"
                                    />
                                    {fieldState.error &&(
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name='password'
                            control={form.control}
                            render={({field,fieldState})=>(
                                <Field data-invalid = {fieldState.invalid}>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Password"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error &&(
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name='confirmPassword'
                            control={form.control}
                            render={({field,fieldState})=>(
                                <Field data-invalid = {fieldState.invalid}>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Confirm Password"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error &&(
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Sign up
                        </Button>
                        </FieldGroup>
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
                    Sign up with Google
                </Button>
                <Button
                    disabled={false}
                    variant="secondary"
                    size='lg'
                    className="w-full"
                    >
                    <FaGithub className="mr-2" />
                    Sign up with Github
                </Button>
            </CardContent>
        </Card>
    );
}