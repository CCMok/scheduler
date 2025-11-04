import { Role, User } from "@/external/prisma-generated";

export type UserWithRole = User & { role: Role }

export type UserExcludePassword = Omit<User, 'password'>

export type UserExcludePasswordWithRole = UserExcludePassword & { role: Role }