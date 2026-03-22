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
import { useState } from "react";

export const SignInCard = () => {
    const [email, setEmail] = useState("");
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