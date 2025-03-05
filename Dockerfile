FROM node:latest
LABEL authors="cylorun"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

RUN npm run build

# needs to manually migrate DB using npx drizzle-kit generate && npx drizzle-kit push

CMD ["npm", "start"]

