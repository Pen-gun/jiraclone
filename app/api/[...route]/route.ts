import { handle } from 'hono/vercel'
import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
    return c.json('Hello Node.js!')
});

app.get('/project/:projectId', (c)=>{
    const {projectId} = c.req.param()
    return c.json({projectId})
})

export const GET = handle(app)
export const POST = handle(app)