FROM node:18-slim

RUN apt update -y
RUN apt-get update && apt-get install git curl wget -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev openssl -y

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/backend/package.json apps/backend/

RUN pnpm install

COPY apps/frontend apps/frontend
COPY apps/backend apps/backend

RUN cd apps/backend && pnpm prisma generate

CMD ["pnpm", "start"]