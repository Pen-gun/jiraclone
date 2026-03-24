import { Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signInFormSchema, signUpFormSchema, onBoardingFormSchema } from '@/features/schemas'
import { prisma} from '@/lib/prismaHelper'

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
        
        const { password: _password, ...safeUser } = user;
        return c.json(safeUser, 200);

})
.post("/register",
    zValidator("json", signUpFormSchema),
    async (c)=>{
        const { email, password} = c.req.valid("json");
        try {
            await prisma.user.create({
                data: {
                    email,
                    password,
                    onBoardingCompleted: false,
                }
            })
        } catch (error) {
            console.error("Registration error:", error);
            return c.json({ error: "Failed to register user" }, 500);
        }
        console.log("Received registration request with email:", email);
        return c.json({email}, 201);
    }
)
.post("/onboarding",
    zValidator("json", onBoardingFormSchema),
    async (c) => {
        const { fullName, age, bio } = c.req.valid("json");
            try {
                const user = await prisma.user.update({
                where: { email },
                data: {
                    fullName,
                    age,
                    bio,
                    onBoardingCompleted: true,
                },
                });

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

export default app;