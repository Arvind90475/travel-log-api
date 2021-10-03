const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { generateToken } = require("../../helpers");

module.exports.signup = async (req, res, next) => {
  const dbUser = await User.find({ email: req.body.email });
  // provided email already exist in db?
  if (dbUser.length) {
    res.status(403);
    throw new Error("Email already taken");
  }
  req.body.password = await bcrypt.hash(req.body.password, 8);
  const newUser = await User.create(req.body);
  const token = generateToken({ userId: newUser._id, role: newUser.role });
  const ONE_DAY_IN_MILISECONDS = 60 * 60 * 24 * 1000;
  res.cookie("token", token, {
    maxAge: ONE_DAY_IN_MILISECONDS,
    httpOnly: true,
  });
  res.status(201).json({ id: newUser._id, email: newUser.email });
};

module.exports.login = async (req, res, next) => {
  const dbUser = await User.findOne({ email: req.body.email }); //find user in db whose email matches with provided one
  if (!dbUser) {
    // provided email does not match with what's inside db
    res.status(401);
    throw new Error("Unauthorized");
  }
  const isPasswordMatched = bcrypt.compareSync(
    req.body.password,
    dbUser.password
  );
  if (!isPasswordMatched) {
    // password does not match
    res.status(401);
    throw new Error("Unauthorized");
  }
  // everything is fine, send token along with user data
  const token = generateToken({ userId: dbUser._id, role: dbUser.role });
  const ONE_DAY_IN_MILISECONDS = 60 * 60 * 24 * 1000;
  res.cookie("token", token, {
    maxAge: ONE_DAY_IN_MILISECONDS,
    httpOnly: true,
  });
  res.status(200).json({ message: "success" });
};

module.exports.logout = async (req, res, next) => {
  res.send("Hello from logout handler");
};
