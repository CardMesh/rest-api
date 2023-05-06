export default (role) => (req, res, next) => {
  if (req.role === role) {
    next();
  } else {
    res.status(403).send({
      errors: ['Forbidden'],
    });
  }
};
