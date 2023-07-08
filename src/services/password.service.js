import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { argon2Options } from '../configs/argon2.config.js';

export const generatePassword = (length) => randomBytes(length)
  .toString('base64')
  .slice(0, length);

export const hashPassword = async (password) => argon2.hash(password, argon2Options);

export const comparePasswords = async (
  password,
  hashedPassword,
) => argon2.verify(hashedPassword, password);
