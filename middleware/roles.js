export default (roles) => (req, res, next) => {
  console.log(req.role);
 // console.log(roles);

 // console.log(roles.includes(req.role));
  if (roles.includes(req.role)) {
    next();
  } else {
    res.status(403).send({
      errors: ['Forbidden'],
    });
  }
};