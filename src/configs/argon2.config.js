import argon2 from 'argon2';

export const argon2Options = {
  type: argon2.argon2id,
  memoryCost: process.env.ARGON2_MEMORY_COST,
  timeCost: process.env.ARGON2_TIME_COST,
  parallelism: process.env.ARGON2_PARALLELISM,
};
