import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";

import { AUTH_COOKIE_NAME } from "@/features/auth/constant";

export const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for the application",
  },
  tags: [
    { name: "Auth", description: "Authentication related endpoints" },
    { name: "User", description: "User management endpoints" },
    { name: "Workspace", description: "Workspace management endpoints" },
  ],
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: AUTH_COOKIE_NAME,
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Successful login", content: { "application/json": { schema: { type: "object" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "User registration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    userId: { type: "string" },
                  },
                },
              },
            },
          },
          "400": { description: "Bad request" },
        },
      },
    },
    "/auth/onboarding": {
      post: {
        tags: ["Auth"],
        summary: "User onboarding",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "age", "bio"],
                properties: {
                  name: { type: "string" },
                  age: { type: "number" },
                  bio: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Onboarding completed successfully" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "User logout",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Logout successful" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["User"],
        summary: "Get current user",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Current user" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/workspaces": {
      get: {
        tags: ["Workspace"],
        summary: "Get user workspaces",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "List of user workspaces",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      ownerId: { type: "string" },
                      inviteCode: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      role: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Workspace"],
        summary: "Create a new workspace",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: { name: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "201": { description: "Workspace created successfully" },
          "400": { description: "Bad request" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/workspaces/{workspaceId}": {
      patch: {
        tags: ["Workspace"],
        summary: "Update workspace",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: { type: "object", required: ["name"], properties: { name: { type: "string" } } },
            },
          },
        },
        responses: {
          "200": { description: "Workspace updated" },
          "400": { description: "Invalid payload" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
          "500": { description: "Internal server error" },
        },
      },
      delete: {
        tags: ["Workspace"],
        summary: "Delete workspace",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Workspace deleted" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
          "500": { description: "Internal server error" },
        },
      },
    },
    "/workspaces/{workspaceId}/reset-invite-code": {
      post: {
        tags: ["Workspace"],
        summary: "Reset workspace invite code",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Invite code reset" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
          "500": { description: "Internal server error" },
        },
      },
    },
    "/workspaces/{workspaceId}/join": {
      post: {
        tags: ["Workspace"],
        summary: "Join workspace by invite code",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "workspaceId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["inviteCode"], properties: { inviteCode: { type: "string" } } },
            },
          },
        },
        responses: {
          "200": { description: "Joined workspace" },
          "400": { description: "Already a member" },
          "404": { description: "Invalid invite code" },
          "500": { description: "Failed to join workspace" },
        },
      },
    },
  },
} as const;

export const registerOpenApiDocuments = (app: Hono) => {
    const basePath = '/test-docs' // test docs base path
    app.get(`${basePath}/openapi.json`, (c) => c.json(openApiDocument))
    app.get(`${basePath}/docs`, swaggerUI({ url: 'openapi.json' }))
}
// to navigate to the docs, go to http://localhost:3000/api/test-docs/docs