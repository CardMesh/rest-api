import dotenv from 'dotenv';

dotenv.config();

export const limiterOptions = {
  windowMs: +process.env.WINDOW_MS,
  max: +process.env.MAX_REQUESTS,
};
