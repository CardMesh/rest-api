import { validationResult } from 'express-validator';

export default (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    res.status(422).json({ errors: errors.array() });
  }
};
