const jwt = require("jsonwebtoken");

const notFound = (req, res, next) => {
  const error = new Error("not found");
  res.status(400);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🍰" : error.stack,
  });
};

const checkTokenAndSetUser = (req, res, next) => {
  const token = req.cookies["token"];
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, user) => {
      if (error) {
        console.log(error.message);
      }
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Unauthorized");
  }
  next();
};

module.exports = {
  notFound,
  errorHandler,
  checkTokenAndSetUser,
  isLoggedIn,
  isAdmin,
};
