import { handle } from 'hono/vercel'
import { Hono } from 'hono'

import auth from '@/features/auth/server/route'

const app = new Hono().basePath('/api')

const routes = app
    .route('/auth', auth)

export type AppType = typeof routes;

export const GET = handle(app)