# STAGE 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN apk update && apk upgrade && npm install
COPY . .
RUN npm run build

# STAGE 2: Run
FROM node:18-alpine
WORKDIR /app
RUN apk update && apk upgrade
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

EXPOSE 5000
CMD ["nodemon", "dist/server.js"]