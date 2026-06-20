FROM node:20-alpine AS builder
WORKDIR /workspace

COPY package*.json ./
COPY backend/package.json ./backend/
RUN npm ci

WORKDIR /workspace/backend
COPY backend/prisma ./prisma/
COPY backend/tsconfig.json ./
COPY backend/src ./src/
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runtime
WORKDIR /workspace

COPY package*.json ./
COPY backend/package.json ./backend/
RUN npm ci --omit=dev

COPY backend/prisma ./backend/prisma/
WORKDIR /workspace/backend
RUN npx prisma generate
COPY --from=builder /workspace/backend/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
