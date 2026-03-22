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
import {Input} from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

export const SignUpCard = () => {
    const [email, setEmail] = useState("");
    return (
        <Card className="w-full h-full md:w-121.7 border-none shadow-none" >
            <CardHeader className="flex flex-col items-center justify-center pt-10">
                <CardTitle className="text-2xl font-bold text-center">
                    Hello my new friend
                </CardTitle>
                <CardDescription>
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                    <Link href="/privacy">
                        <span className="text-blue-500 hover:underline">Privacy Policy</span>
                    </Link>  
                </CardDescription>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <form className="space-y-4">
                    <Input
                        required
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={false}
                    />
                    <Input
                        required
                        type="password"
                        placeholder="Password"
                        disabled={false}
                    />
                    <Button type="submit" className="w-full">
                        Sign up
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