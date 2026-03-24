import { Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signInFormSchema, signUpFormSchema, onBoardingFormSchema } from '@/features/schemas'
import { prisma} from '@/lib/prismaHelper'
import {
    clearAuthCookie,
    createAuthToken,
    getCurrentUserId,
    setAuthCookie,
} from '@/lib/auth-token'

const app = new Hono()
.post("/login", 
    zValidator("json", signInFormSchema), 
    async (c)=>{
        const { email, password} = c.req.valid("json");
        const user = await prisma.user.findUnique({
            where: { email },
        });
            if (!user) {
                console.log("Login failed: User not found for email:", email);
                return c.json({ error: "Invalid email or password" }, 401);
            }
            if (user.password !== password) {
                console.log("Login failed: Incorrect password for email:", email);
                return c.json({ error: "Invalid email or password" }, 401);
            }
        console.log("Received login request with email:", email);

        const token = await createAuthToken({
            userId: user.id,
            email: user.email,
            onBoardingCompleted: user.onBoardingCompleted,
        });
        setAuthCookie(c, token);
        
        const { password: _password, ...safeUser } = user;
        return c.json(safeUser, 200);

})
.post("/register",
    zValidator("json", signUpFormSchema),
    async (c)=>{
        const { email, password} = c.req.valid("json");
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password,
                    onBoardingCompleted: false,
                }
            });

            const token = await createAuthToken({
                userId: user.id,
                email: user.email,
                onBoardingCompleted: user.onBoardingCompleted,
            });
            setAuthCookie(c, token);

            const { password: _password, ...safeUser } = user;
            console.log("Received registration request with email:", email);
            return c.json(safeUser, 201);
        } catch (error) {
            console.error("Registration error:", error);
            return c.json({ error: "Failed to register user" }, 500);
        }
    }
)
.post("/onboarding",
    zValidator("json", onBoardingFormSchema),
    async (c) => {
        const { fullName, age, bio } = c.req.valid("json");
        const userId = await getCurrentUserId(c);
        if (!userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

            try {
                const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    fullName,
                    age,
                    bio,
                    onBoardingCompleted: true,
                },
                });

                const Token = await createAuthToken({
                    userId: user.id,
                    email: user.email,
                    onBoardingCompleted: user.onBoardingCompleted,
                });
                setAuthCookie(c, Token);

                console.log("Updated onboarding for:", user.email);

                const { password, ...safeUser } = user;
                return c.json(safeUser, 200);
            } catch (error) {
                console.error("Onboarding error:", error);

                return c.json(
                { error: "Failed to update onboarding profile" },
                500
                );
            }
            }
)
.post("/logout", async (c) => {
    clearAuthCookie(c);
    return c.json({ message: "Logged out successfully" }, 200);
})
.get("/me", async (c) => {
    const userId = await getCurrentUserId(c);
    if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return c.json({ error: "User not found" }, 404);
    }
    const { password, ...safeUser } = user;
    return c.json(safeUser, 200);
});

export default app;