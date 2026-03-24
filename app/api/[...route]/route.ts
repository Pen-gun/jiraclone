import { handle } from 'hono/vercel'
import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
    return c.json('Hello Node.js!')
});

export const GET = handle(app)
export const POST = handle(app)