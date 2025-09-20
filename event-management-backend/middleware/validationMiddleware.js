const { validationResult } = require("express-validator");
const { ValidationError } = require("../utils/Errors");

const validateRequest = (validator) => {
    return [
      validator,
      (req,res,next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
          throw new ValidationError(result.array());
        }
        next();
      },
    ];
};

module.exports = {
  validateRequest,
};
