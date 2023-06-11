export default (roles) => (req, res, next) => {
  if (roles.includes(req.role)) {
    next();
  } else {
    res.status(403)
      .send({
        errors: ['Forbidden.'],
      });
  }
};
