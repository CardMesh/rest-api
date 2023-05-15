import User from '../model/User.js';

const checkUserAccess = async (req, res, next) => {
  const user = await User.findOne({ uuid: req.params.id }).exec(); // TODO req.id

  // Check if the user is trying to access someone else's data and is not an admin
  if (req.params.id !== req.id && user.role !== 'admin') {
    return res.status(400).json({ error: 'You are not allowed to access this user' });
  }

  // Pass the user object to the next middleware or route handler
  req.user = user;
  next();
};

export default checkUserAccess;
