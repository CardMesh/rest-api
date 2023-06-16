import { body } from 'express-validator';

export const signupRules = [
  body('email')
    .isEmail(),
  body('name')
    .isLength({
      min: 4,
      max: 255,
    }),
];

export const loginRules = [
  body('email')
    .isEmail(),
  body('password')
    .isLength({
      min: 8,
      max: 255,
    }),
];

export const recoverRules = [
  body('uuid')
    .isUUID(),
];

export const resetRules = [
  body('email')
    .isEmail(),
  body('password')
    .isLength({
      min: 8,
      max: 255,
    }),
];