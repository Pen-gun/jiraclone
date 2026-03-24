import { Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signInFormSchema, signUpFormSchema, onBoardingFormSchema } from '@/features/schemas'

const app = new Hono()
.post("/login", 
    zValidator("json", signInFormSchema), 
    (c)=>{
        const { email, password} = c.req.valid("json");
        console.log("Received login request with email:", email);
    return c.json({email, password})
})
.post("/register",
    zValidator("json", signUpFormSchema),
    (c)=>{
        const { email, password} = c.req.valid("json");
        console.log("Received registration request with email:", email);
    return c.json({email, password})
})
.post("/onboarding",
    zValidator("json", onBoardingFormSchema),
    (c)=>{
        const { fullName, age, bio} = c.req.valid("json");
        console.log("Received onboarding request with full name:", fullName);
        return c.json({ fullName, age, bio });
    }
)

export default app;