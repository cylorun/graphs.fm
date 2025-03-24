# Use the latest Node.js image as a base
FROM node:latest

LABEL authors="cylorun"

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory to /app inside the container
WORKDIR /app

# Copy the root package.json, pnpm-lock.yaml, and pnpm-workspace.yaml (from the root of the monorepo)
# This assumes that the build context is set to the root of the monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies for all workspaces in the monorepo
RUN pnpm install

# Now, copy the cron code into the container
COPY ./cron ./cron
COPY ./shared ./shared

RUN pnpm install

CMD ["pnpm", "--filter", "cron", "start"]
