import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "external/prisma/schema.prisma",
  migrations: {
    path: "external/prisma/migrations",
    seed: `tsx external/prisma/seed.ts`,
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
