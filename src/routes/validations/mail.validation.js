import { body } from 'express-validator';

export const mailRules = [
  body('email')
    .isEmail(),
];
