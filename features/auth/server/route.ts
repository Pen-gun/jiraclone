import { Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { signInFormSchema } from '@/features/schemas'

const app = new Hono()
.post("/login", 
    zValidator("json", signInFormSchema), 
    (c)=>{
    return c.json({message:"Login successful"})
})
export default app;