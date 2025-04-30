# STAGE 1: Build
FROM node:20-alpine@sha256:c628bdc7ebc7f95b1b23249a445eb415ce68ae9def8b68364b35ee15e3065b0f AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# STAGE 2: Production
FROM node:20-alpine@sha256:c628bdc7ebc7f95b1b23249a445eb415ce68ae9def8b68364b35ee15e3065b0f
WORKDIR /app

# Only copy built output and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# .env file should be mounted at runtime or handled via docker-compose

EXPOSE 5000
CMD ["node", "dist/server.js"]
