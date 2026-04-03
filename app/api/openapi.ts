import { swaggerUI } from '@hono/swagger-ui'
import type { Hono } from 'hono'

import { AUTH_COOKIE_NAME } from '@/features/auth/constant'

export const openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Jira Clone API',
        version: '1.0.1',
        description: 'API documentation for auth, workspace, and members endpoints.',
    },
    tags: [
        {
            name: 'Authentication',
            description: 'Login, registration, and session lifecycle endpoints.',
        },
        {
            name: 'User',
            description: 'Current user profile and onboarding endpoints.',
        },
        {
            name: 'Workspace Management',
            description: 'Workspace listing and CRUD actions.',
        },
        {
            name: 'Member Management',
            description: 'Workspace member listing and role management actions.',
        },
    ],
    servers: [
        {
            url: '/api',
        },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: AUTH_COOKIE_NAME,
            },
        },
    },
    paths: {
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Sign in user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Signed in' },
                    '401': { description: 'Invalid credentials' },
                },
            },
        },
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Registered' },
                    '500': { description: 'Registration failed' },
                },
            },
        },
        '/auth/onboarding': {
            post: {
                tags: ['User'],
                summary: 'Complete onboarding',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fullName: { type: 'string' },
                                    age: { type: 'integer' },
                                    bio: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Onboarding completed' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/auth/logout': {
            post: {
                tags: ['Authentication'],
                summary: 'Sign out user',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Logged out' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['User'],
                summary: 'Get current user',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Current user' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/workspaces': {
            get: {
                tags: ['Workspace Management'],
                summary: 'List user workspaces',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Workspace list' },
                    '401': { description: 'Unauthorized' },
                },
            },
            post: {
                tags: ['Workspace Management'],
                summary: 'Create workspace',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Workspace created' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/workspaces/{workspaceId}': {
            patch: {
                tags: ['Workspace Management'],
                summary: 'Update workspace',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'workspaceId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Workspace updated' },
                    '400': { description: 'Invalid payload' },
                    '403': { description: 'Forbidden' },
                    '404': { description: 'Not found' },
                    '500': { description: 'Internal server error' },
                },
            },
            delete: {
                tags: ['Workspace Management'],
                summary: 'Delete workspace',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'workspaceId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Workspace deleted' },
                    '403': { description: 'Forbidden' },
                    '404': { description: 'Not found' },
                    '500': { description: 'Internal server error' },
                },
            },
        },
        '/workspaces/{workspaceId}/reset-invite-code': {
            post: {
                tags: ['Workspace Management'],
                summary: 'Reset workspace invite code',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'workspaceId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Invite code reset' },
                    '403': { description: 'Forbidden' },
                    '404': { description: 'Not found' },
                    '500': { description: 'Internal server error' },
                },
            },
        },
        '/workspaces/{workspaceId}/join': {
            post: {
                tags: ['Workspace Management'],
                summary: 'Join workspace by invite code',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'workspaceId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['inviteCode'],
                                properties: {
                                    inviteCode: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Joined workspace' },
                    '400': { description: 'Already a member' },
                    '404': { description: 'Invalid invite code' },
                    '500': { description: 'Failed to join workspace' },
                },
            },
        },
        '/members': {
            get: {
                tags: ['Member Management'],
                summary: 'List workspace members',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'workspaceId',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Workspace members list' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/members/{memberId}': {
            patch: {
                tags: ['Member Management'],
                summary: 'Update workspace member role',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'memberId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                    {
                        name: 'workspaceId',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['role'],
                                properties: {
                                    role: {
                                        type: 'string',
                                        enum: ['MEMBER', 'ADMIN'],
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Member role updated' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Forbidden' },
                    '404': { description: 'Member not found' },
                },
            },
            delete: {
                tags: ['Member Management'],
                summary: 'Remove workspace member',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'memberId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                    {
                        name: 'workspaceId',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Member removed' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Forbidden' },
                    '404': { description: 'Member not found' },
                },
            },
        },
    },
} as const

export const registerOpenApiDocs = (app: Hono) => {
    app.get('/openapi.json', (c) => c.json(openApiDocument))
    app.get('/docs', swaggerUI({ url: '/api/openapi.json' }))
}