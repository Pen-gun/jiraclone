import { z } from "zod";
export const signInFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required").max(100, "Password must be less than 100 characters long")
});

export const signUpFormSchema = z.object({
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

export const onBoardingFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(100, "Full name must be less than 100 characters long"),
    age: z.number().min(0, "Age must be a positive number").max(120, "Age must be less than 120"),
    bio: z.string().max(500, "Bio must be less than 500 characters long").optional(),
})