import { body } from 'express-validator';

export const imageRules = [
  body('imageHeight')
    .isInt({ min: 1 }),
];

export const themeOptionsRules = [ // TODO add missing color..
  body('color.background')
    .isHexColor(),
  body('logo.size.height')
    .isInt({ min: 1 }),
  body('display.phone')
    .isBoolean(),
  body('display.sms')
    .isBoolean(),
  body('display.email')
    .isBoolean(),
  body('display.web')
    .isBoolean(),
  body('display.address')
    .isBoolean(),
  body('display.map')
    .isBoolean(),
  body('display.vCardBtn')
    .isBoolean(),
];
