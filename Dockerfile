FROM node:18-slim

RUN apt-get update -y
RUN apt-get clean
RUN apt-get install git curl wget build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev openssl -y --no-install-recommends

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/backend/package.json apps/backend/

RUN pnpm install

COPY apps/frontend apps/frontend
COPY apps/backend apps/backend

RUN cd apps/backend && pnpm prisma generate
RUN pnpm run -r build

RUN pnpm install --prod

CMD ["pnpm", "start"]