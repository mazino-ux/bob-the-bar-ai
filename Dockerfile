# STAGE 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Build the application
RUN npm run build

# STAGE 2: Run
FROM node:20-alpine
WORKDIR /app

# Copy built files
COPY --from=builder /dist ./dist
COPY --from=builder /node_modules ./node_modules

# Copy only necessary files for production
COPY package*.json ./
COPY .env.production .env

# Expose port and start
EXPOSE 5000
CMD ["node", "dist/server.js"]