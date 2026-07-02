# ── STAGE 1: BUILDER ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install native compilation requirements for Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy dependency structures
COPY package*.json ./
COPY prisma ./prisma/

# Clean install all dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Generate Prisma Client (targeting musl explicitly) and compile NestJS
RUN npx prisma generate --binary-targets "native" "linux-musl-openssl-3.0.x"
RUN npm run build


# ── STAGE 2: PRODUCTION RUNTIME ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Ensure native binaries can resolve libraries in runtime container
RUN apk add --no-cache openssl libc6-compat

# Expose port 4000 to Render's load balancer
EXPOSE 4000

# Copy over only the pre-compiled assets from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Execute migrations over the cloud network, then boot the raw node app
# Override DATABASE_URL with the DIRECT_URL just for the migration script, then boot Node safely
CMD sh -c "DATABASE_URL=\$DIRECT_URL npx prisma migrate deploy && node dist/main"