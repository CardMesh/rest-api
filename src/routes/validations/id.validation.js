import { param } from 'express-validator';

export const idRules = [
  param('id')
    .isUUID(),
];
