// eslint-disable-next-line import/prefer-default-export
export const notFound = (req, res) => {
  res.status(404).json({
    errors: ['Not found'],
  });
};
