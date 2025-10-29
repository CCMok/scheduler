import { Role, User } from "@/external/prisma-generated";

export type UserRole = User & { role: Role }

export type UserExcludePassword = Omit<User, 'password'>

export type UserExcludePasswordRole = UserExcludePassword & { role: Role }