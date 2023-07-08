export const notFound = (req, res) => {
  res.status(404)
    .json({
      errors: ['Not found.'],
    });
};
