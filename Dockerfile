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

# Build the static assets for production
# This will create a 'dist' folder.
RUN pnpm run build

# ---- Runtime Stage ----
# Sets up a lightweight server to serve the static files.
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

# Set PNPM_HOME and add it to the PATH to fix global installs
ENV PNPM_HOME="/pnpm"
ENV PATH="/pnpm:$PATH"

# Install 'serve', a lightweight static file server
RUN corepack enable pnpm && pnpm add -g serve

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy the built static assets from the builder stage
# Vite outputs to a 'dist' folder by default.
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist

# Switch to the non-root user
USER appuser

# Expose the port the server will run on.
# We use 3000 to match your Traefik configuration.
EXPOSE 3000

ENV PORT=3000

# Start the 'serve' command to serve the 'dist' folder.
# The "-s" flag is crucial for Single Page Applications (SPAs) like React,
# as it rewrites all not-found requests to index.html.
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]