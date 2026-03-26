import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signInFormSchema, signUpFormSchema, onBoardingFormSchema } from '@/features/schemas'
import { prisma } from '@/lib/prismaHelper'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { AUTH_COOKIE_NAME } from '../constant'
import { sessionMiddleware} from '@/lib/session-middelware'


const app = new Hono()
    .post("/login",
        zValidator("json", signInFormSchema),
        async (c) => {
            const { email, password } = c.req.valid("json");
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
            const Token = await prisma.session.create({
                data: {
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
                }
            });
            setCookie(c, AUTH_COOKIE_NAME, Token.id, {
                path: "/",
                httpOnly: true,
                secure: true, 
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60, 
            });

            const { password: _password, ...safeUser } = user;
            return c.json(safeUser, 200);

        })
    .post("/register",
        zValidator("json", signUpFormSchema),
        async (c) => {
            const { email, password } = c.req.valid("json");
            try {
                const user = await prisma.user.create({
                    data: {
                        email,
                        password,
                        onBoardingCompleted: false,
                    }
                });
                const Token = await prisma.session.create({
                    data: {
                        userId: user.id,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
                    }
                });
                setCookie(c, AUTH_COOKIE_NAME, Token.id, {
                    path: "/",
                    httpOnly: true,
                    secure: true, // Set to true in production with HTTPS
                    sameSite: "Lax",
                    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
                });

                const { password: _password, ...safeUser } = user;
                console.log("Received registration request with email:", email);
                return c.json(safeUser, 201);
            } catch (error) {
                console.error("Registration error:", error);
                return c.json({ error: "Failed to register user" }, 500);
            }
        }
    )
    .post("/onboarding", sessionMiddleware,
        zValidator("json", onBoardingFormSchema),
        async (c) => {
            const { fullName, age, bio } = c.req.valid("json");
            const user = c.get("account");
            try {
                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        fullName,
                        age,
                        bio,
                        onBoardingCompleted: true,
                    },
                });
                console.log("Updated onboarding for:", updatedUser.email);

                const { password, ...safeUser } = updatedUser;
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
    .post("/logout",sessionMiddleware, async (c) => {
        const sessionId = getCookie(c, AUTH_COOKIE_NAME);
        if (sessionId) {
            await prisma.session.delete({
                where: { id: sessionId },
            });
        }
        deleteCookie(c, AUTH_COOKIE_NAME, {
            path: "/",
        });
        return c.json({ message: "Logged out successfully" }, 200);
    })
    .get("/me", sessionMiddleware, async (c) => {
        const user = c.get("account");
        if (!user) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        return c.json(user, 200);
    });

export default app;