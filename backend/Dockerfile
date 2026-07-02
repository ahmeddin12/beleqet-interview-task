# ── STAGE 1: BUILDER ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl (required for Prisma engines)
RUN apk add --no-cache openssl

# Copy dependency structures
COPY package*.json ./
COPY prisma ./prisma/

# Clean install all dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Generate Prisma Client and compile NestJS TypeScript to JavaScript
RUN npm run prisma:generate
RUN npm run build


# ── STAGE 2: PRODUCTION RUNTIME ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Re-install openssl in the clean runtime environment for Prisma engine binaries
RUN apk add --no-cache openssl

# Expose port 4000 to Render's load balancer
EXPOSE 4000

# Copy over only the pre-compiled assets from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Execute migrations over the cloud network, then boot the raw node app
CMD sh -c "npx prisma migrate deploy && node dist/main"