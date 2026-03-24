import { Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signInFormSchema } from '@/features/schemas'

const app = new Hono()
.post("/login", 
    zValidator("json", signInFormSchema), 
    (c)=>{
        const { email, password} = c.req.valid("json");
        console.log("Received login request with email:", email);
    return c.json({email, password})
})
export default app;