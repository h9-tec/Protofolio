# Multi-stage Docker image for the portfolio app located in ./hesham-portfolio
# - Stage 1: Build client (Vite) and server bundle (esbuild)
# - Stage 2: Install production deps and run the Node server that serves the static build

FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Pre-copy lockfile and package metadata to leverage Docker layer caching
COPY hesham-portfolio/pnpm-lock.yaml ./pnpm-lock.yaml
COPY hesham-portfolio/package.json ./package.json
COPY hesham-portfolio/patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source and build
COPY hesham-portfolio/ ./
RUN pnpm run build


FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy built artifacts
COPY --from=build /app/dist ./dist

# Install only production dependencies for the server (express, etc.)
COPY hesham-portfolio/pnpm-lock.yaml ./pnpm-lock.yaml
COPY hesham-portfolio/package.json ./package.json
COPY hesham-portfolio/patches ./patches
RUN pnpm install --prod --frozen-lockfile

# Railway provides PORT; our server reads process.env.PORT
EXPOSE 3000

CMD ["node", "dist/index.js"]


