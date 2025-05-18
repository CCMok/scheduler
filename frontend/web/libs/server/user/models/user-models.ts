import { Role, User } from "@/external/prisma-generated";

export type UserRole = User & { role: Role }