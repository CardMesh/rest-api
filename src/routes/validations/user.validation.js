import { body } from 'express-validator';

export const imageRules = [
  body('imageHeight')
    .isInt({ min: 1 }),
];

export const vCardRules = [
  body('person.firstName')
    .optional()
    .isString(),
  body('person.middleName')
    .optional()
    .isString(),
  body('person.lastName')
    .optional()
    .isString(),
  body('person.suffix')
    .optional()
    .isString(),
  body('person.birthday')
    .optional()
    .isString(),
  body('person.pronouns')
    .optional()
    .isString(),

  body('professional.title')
    .optional()
    .isString(),
  body('professional.company')
    .optional()
    .isString(),
  body('professional.role')
    .optional()
    .isString(),
  body('professional.bio')
    .optional()
    .isString(),

  body('contact.phone.number')
    .optional()
    .isString(),
  body('contact.phone.extension')
    .optional()
    .isString(),
  body('contact.email')
    .optional()
    .isString(),
  body('contact.web')
    .optional({ checkFalsy: true })
    .isURL(),

  body('location.street')
    .optional()
    .isString(),
  body('location.storey')
    .optional()
    .isString(),
  body('location.city')
    .optional()
    .isString(),
  body('location.state')
    .optional()
    .isString(),
  body('location.postalCode')
    .optional()
    .isString(),
  body('location.country')
    .optional()
    .isString(),
  body('location.timeZone')
    .optional()
    .isString(),
  body('location.coordinates.latitude')
    .optional()
    .isFloat(),
  body('location.coordinates.longitude')
    .optional()
    .isFloat(),

  body('socialMedia.twitter')
    .optional({ checkFalsy: true })
    .isURL(),
  body('socialMedia.linkedin')
    .optional({ checkFalsy: true })
    .isURL(),
  body('socialMedia.facebook')
    .optional({ checkFalsy: true })
    .isURL(),
  body('socialMedia.instagram')
    .optional({ checkFalsy: true })
    .isURL(),
  body('socialMedia.pinterest')
    .optional({ checkFalsy: true })
    .isURL(),
  body('socialMedia.github')
    .optional({ checkFalsy: true })
    .isURL(),
];
