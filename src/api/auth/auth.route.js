const { Router } = require("express");

const User = require("../../models/user");
const { tryCatchWrapper } = require("../../helpers");
const {
  login,
  signup,
  logout,
  forgotPassword,
  changePassword,
} = require("./auth.controller");

const { isLoggedIn } = require("../../middlewares");
const {
  validateUserBody,
  validateForgotPasswordBody,
} = require("../../validations/user");

const router = Router();

router.post("/signup", validateUserBody, tryCatchWrapper(signup));
router.post("/login", validateUserBody, tryCatchWrapper(login));
router.get("/logout", validateUserBody, tryCatchWrapper(logout));
router.post(
  "/forgot-password",
  validateForgotPasswordBody,
  tryCatchWrapper(forgotPassword)
);

router.post("/change-password", tryCatchWrapper(changePassword));

router.get("/users", isLoggedIn, async (req, res, next) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

module.exports = router;
