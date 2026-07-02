# ── STAGE 1: BUILDER ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install native compilation requirements for Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Copy dependency mappings
COPY package*.json ./
COPY prisma ./prisma/

# Clean install all dependencies (both dev and prod)
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Generate Prisma Client (reads binaryTargets from schema.prisma)
RUN npx prisma generate

# Compile NestJS TypeScript source to raw production JavaScript
RUN npm run build


# ── STAGE 2: PRODUCTION RUNTIME ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Ensure native OpenSSL binaries can resolve libraries in the runtime environment
RUN apk add --no-cache openssl libc6-compat

# Expose port 4000 to Render's load balancer
EXPOSE 4000

# Copy over only the pre-compiled assets from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Execute migrations safely over the direct URL, then boot the raw application
CMD sh -c "DATABASE_URL=\$DIRECT_URL npx prisma migrate deploy && npm run prisma:seed && node dist/main"