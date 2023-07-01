import { param } from 'express-validator';

export const userIdRules = [
  param('id')
    .isUUID(),
];

export const themeIdRules = [
  param('id')
    .isInt(),
];
