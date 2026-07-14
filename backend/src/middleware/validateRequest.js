export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      if (req.body) {
        req.body = await schema.parseAsync(req.body);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
