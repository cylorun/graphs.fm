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

# Now, copy the backend code into the container
COPY ./frontend ./frontend
COPY ./shared ./shared

RUN pnpm install

# Expose the port that the backend will run on
EXPOSE 5000

# Run the build script for the backend
RUN pnpm --filter frontend build

# Set the command to start the backend
CMD ["pnpm", "--filter", "frontend", "start"]
