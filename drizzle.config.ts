import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    driver: undefined,
    dbCredentials: {
        host: process.env.DATABASE_HOST!,
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,
        database: process.env.DATABASE_NAME!,
    },
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    // @ts-ignore
    ssl: process.env.NODE_ENV !== "production",
});
