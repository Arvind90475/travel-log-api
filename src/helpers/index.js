const jwt = require("jsonwebtoken");

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

function tryCatchWrapper(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  tryCatchWrapper,
  generateToken,
};
