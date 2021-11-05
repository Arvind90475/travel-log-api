const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { generateToken } = require("../../helpers");
const { sendEmail } = require("../../helpers/sendEmail");

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
  const dbUser = await User.findOne({ email: req.body.email });
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
    res.status(401);
    throw new Error("Unauthorized");
  }

  // everything is fine, send token with user data inside cookie
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

module.exports.forgotPassword = async (req, res, next) => {
  //TODO: fix status code
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email does not exist in our system");
  }

  const token = generateToken({ userId: user._id });
  const options = {
    subject: "Password Reset",
    text: "Please click on the link to reset password",
    html: `<a href="http://localhost:5000/${token}">Reset Password</a>`,
  };
  // should send the reset email link to frontend that contains token in the url
  // FE takes the token from the url and sends it along with new password
  sendEmail(options);
  res.json({ message: "success" });
};

module.exports.changePassword = async (req, res, next) => {
  //get the token from the body
  let userId;
  if (!req.body.token || !req.body.password)
    throw new Error("Missing required field");

  jwt.verify(req.body.token, process.env.JWT_TOKEN_SECRET, (error, user) => {
    if (error) {
      throw new Error("Token malformed");
    }
    userId = user.id;
  });

  //TODO: invalidate the token so it can't be use for further resetting password
  //TODO: fix status code

  const user = await User.findOne({ id: userId });
  user.password = await bcrypt.hash(req.body.password, 8);
  user.save();
  res.json({ message: "success" });
};
