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
  body('userId')
    .isUUID(),
];

export const resetRules = [
  body('email')
    .isEmail(),
  body('token')
    .isLength({
      min: 64,
      max: 64,
    }),
  body('password')
    .isLength({
      min: 8,
      max: 255,
    }),
];
