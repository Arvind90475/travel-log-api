const { Router } = require("express");

const tryCatchWrapper = require("../../helpers");
const { login, signup, logout } = require("./auth.controller");
const User = require("../../models/user");

const { isLoggedIn } = require("../../middlewares");

const router = Router();

router.post("/signup", tryCatchWrapper(signup));
router.post("/login", tryCatchWrapper(login));
router.get("/logout", tryCatchWrapper(logout));

router.get("/users", isLoggedIn, async (req, res, next) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

module.exports = router;
