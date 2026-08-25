FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV CI=true

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY . .

RUN DATABASE_URL=postgresql://placeholder npx prisma generate
RUN pnpm build
RUN npx tsc prisma.config.ts --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --outDir .

FROM base AS runner
ENV NODE_ENV=production
RUN apk add --no-cache openssl curl

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma generated client
COPY --from=builder /app/generated/prisma ./generated/prisma

# Copy Prisma schema for migrations
COPY --from=builder /app/prisma ./prisma

# Install prisma CLI for migrations (small overhead but ensures it works)
RUN npm install -g prisma@7.5.0

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]