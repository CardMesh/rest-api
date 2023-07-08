import User from '../models/user.model.js';

// eslint-disable-next-line consistent-return
const accessMiddleware = async (req, res, next) => {
  const user = await User.findOne({ userId: req.id })
    .exec();

  // Check if the user is trying to access someone else's data and is not an admin
  if (req.params.id !== req.id && user.role !== 'admin') {
    return res.status(400)
      .json({ errors: ['You are not allowed to access this user.'] });
  }

  // Pass the user object to the next middleware or route handler
  req.user = user;
  next();
};

export default accessMiddleware;
