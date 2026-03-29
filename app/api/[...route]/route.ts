import { handle } from 'hono/vercel'
import { Hono } from 'hono'

import auth from '@/features/auth/server/route'
import workspace from '@/features/workspaces/server/route'

const app = new Hono().basePath('/api')

const routes = app
    .route('/auth', auth)
    .route('/workspaces', workspace)

export type AppType = typeof routes;

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)