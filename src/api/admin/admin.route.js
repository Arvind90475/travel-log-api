const { Router } = require("express");

const User = require("../../models/user");
const tryCatchWrapper = require("../../helpers");

const router = Router();

router.get(
  "/user",
  tryCatchWrapper(async (req, res, next) => {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  })
);

router.delete(
  "/user",
  tryCatchWrapper(async (req, res, next) => {
    await User.deleteMany({ role: "user" });
    res.status(201).json({ message: "ok" });
  })
);

module.exports = router;
