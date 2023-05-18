import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401)
      .json({ errors: ['Access denied'] });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = data.id;
    req.role = data.role;
    next();
  } catch (error) {
    res.status(400)
      .json({ errors: ['Token is invalid'] });
  }
};

export default verifyToken;
