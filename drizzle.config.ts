import * as dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Optional: Specify the migrations table and schema
  // This is useful if you want to keep your migrations organized.
   migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
  // Additional options
  verbose: true,
  strict: true,
});
