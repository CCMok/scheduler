import 'server-only'
import bcrypt from 'bcryptjs';

const saltRounds = 12;

export const encrypt = async (plain: string): Promise<string> =>
  await bcrypt.hash(plain, saltRounds);

export const compare = async (plain: string, hash: string): Promise<boolean> =>
  await bcrypt.compare(plain, hash);