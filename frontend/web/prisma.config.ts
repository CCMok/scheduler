import "dotenv/config";
import type { PrismaConfig } from "prisma";

export default {
  schema: "external/prisma/schema.prisma",
} satisfies PrismaConfig;