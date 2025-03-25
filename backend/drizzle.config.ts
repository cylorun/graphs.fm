import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    driver: undefined,
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    dialect: "postgresql",
    schema: "../shared/drizzle/schema.ts",
    out: "./drizzle",
    // @ts-ignore
    ssl: process.env.NODE_ENV !== "production",
});
