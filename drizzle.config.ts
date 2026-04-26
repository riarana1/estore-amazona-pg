import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config({
  path: "./.env.local",
})

if (typeof process.env.DATABASE_URL === "undefined") {
  throw new Error("DATABASE_URL environment variable is not defined")
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql", // or "mysql" | "sqlite"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
