FROM node:20-alpine AS builder
WORKDIR /workspace

# Workspace root (has package-lock.json)
COPY package*.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
COPY shared/tsconfig.json ./shared/
RUN npm ci

# Build shared → dist/index.js
COPY shared/src ./shared/src/
WORKDIR /workspace/shared
RUN npx tsc

# Build backend
WORKDIR /workspace/backend
COPY backend/prisma ./prisma/
COPY backend/tsconfig.json ./
COPY backend/src ./src/
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runtime
WORKDIR /workspace

COPY package*.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
RUN npm ci --omit=dev

COPY backend/prisma ./backend/prisma/
COPY --from=builder /workspace/shared/dist ./shared/dist

WORKDIR /workspace/backend
RUN npx prisma generate
COPY --from=builder /workspace/backend/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
