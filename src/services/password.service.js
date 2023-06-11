import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export const generatePassword = (length) => randomBytes(length)
  .toString('base64')
  .slice(0, length);

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
