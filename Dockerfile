# syntax=docker/dockerfile:1.4

# ---- Builder Stage ----
# Installs all dependencies and builds the static assets.
FROM node:24-alpine AS builder
WORKDIR /app

# Use corepack to enable pnpm
RUN corepack enable pnpm

# Copy only the dependency manifests to leverage Docker cache
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Sets up a lightweight server to serve the Next.js application.
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy the built Next.js standalone application from the builder stage
# Next.js with output: 'standalone' creates a .next/standalone directory
COPY --from=builder --chown=appuser:nodejs /app/.next/standalone ./
COPY --from=builder --chown=appuser:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:nodejs /app/public ./public

# Switch to the non-root user
USER appuser

# Expose the port the server will run on.
# We use 3000 to match your Traefik configuration.
EXPOSE 3000

ENV PORT=3000

# Start the Next.js server
CMD ["node", "server.js"]