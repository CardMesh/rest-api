import { body } from 'express-validator';

export const userRules = [
  body('name').isLength({ min: 4, max: 255 }),
];

export const userStatisticsLookupsRules = [
  body('entryPoint').isString(),
];

export const userSettingsLanguageRules = [
  body('language').isLength({ min: 2, max: 2 }),
];
