import jwt from 'jsonwebtoken';

// eslint-disable-next-line consistent-return
const verifyMiddleware = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401)
      .json({ errors: ['Access denied.'] });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = data.id;
    req.role = data.role;
    next();
  } catch (err) {
    res.status(400)
      .json({ errors: ['Token is invalid.'] });
  }
};

export default verifyMiddleware;
