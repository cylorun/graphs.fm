FROM node:latest

LABEL authors="cylorun"

# installs pnpm globally
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY ./websocket ./websocket
COPY ./shared ./shared

RUN pnpm install

CMD ["pnpm", "--filter", "websocket", "start"]
