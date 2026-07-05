import { User } from "@/external/prisma/generated/client";

export type UserOmitPassword = Omit<User, 'password'>