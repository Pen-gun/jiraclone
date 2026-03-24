import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

const AUTH_COOKIE_NAME = "auth_token";
const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AuthTokenPayload = {
  userId: string;
  email: string;
  onBoardingCompleted: boolean;
  exp: number;
  iat: number;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
};

export const createAuthToken = async (input: {
  userId: string;
  email: string;
  onBoardingCompleted: boolean;
}) => {
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthTokenPayload = {
    userId: input.userId,
    email: input.email,
    onBoardingCompleted: input.onBoardingCompleted,
    iat: now,
    exp: now + AUTH_TOKEN_MAX_AGE_SECONDS,
  };

  return sign(payload, getJwtSecret());
};

export const verifyAuthToken = async (token: string) => {
  const payload = await verify(token, getJwtSecret(), "HS256");
  return payload as AuthTokenPayload;
};

export const setAuthCookie = (c: Context, token: string) => {
  setCookie(c, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  });
};

export const clearAuthCookie = (c: Context) => {
  deleteCookie(c, AUTH_COOKIE_NAME, {
    path: "/",
  });
};

export const getAuthTokenFromCookie = (c: Context) => {
  return getCookie(c, AUTH_COOKIE_NAME) ?? null;
};

export const getCurrentUserId = async (c: Context) => {
  const token = getAuthTokenFromCookie(c);
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);
    return payload.userId;
  } catch {
    return null;
  }
};
