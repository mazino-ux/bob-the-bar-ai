# STAGE 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# STAGE 2: Production
FROM node:20-alpine
WORKDIR /app

# Only copy built output and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy .env if present (optional, or mount at runtime)
COPY .env .env

EXPOSE 5000
CMD ["node", "dist/server.js"]
