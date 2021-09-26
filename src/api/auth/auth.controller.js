const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { user } = require("../../validations/user");

module.exports.signup = async (req, res, next) => {
  // validating the req.body
  const { error, value } = user.validate(req.body);
  if (error) {
    res.status(422);
    throw new Error(`validation error ${error}`);
  }
  const dbUser = await User.find({ email: value.email });
  // provided email already exist in db?
  if (dbUser.length) {
    res.status(403);
    throw new Error("Email already taken");
  }
  value.password = await bcrypt.hash(value.password, 8);
  const newUser = await User.create(value);
  res.status(201).json({ id: newUser._id, email: newUser.email });
};

module.exports.login = async (req, res, next) => {
  const { error, value } = user.validate(req.body);
  if (error) {
    res.status(422);
    throw new Error(`validation error, ${error.message}`);
  }
  const dbUser = await User.findOne({ email: value.email }); //find user in db whose email matches with provided one
  if (!dbUser) {
    // provided email does not match with what's inside db
    res.status(401);
    throw new Error("Unauthorized");
  }
  const isPasswordMatched = bcrypt.compareSync(value.password, dbUser.password);
  if (!isPasswordMatched) {
    // password does not match
    res.status(401);
    throw new Error("Unauthorized");
  }
  // everything is fine, send token along with user data
  const token = jwt.sign(
    { userId: dbUser._id, role: dbUser.role },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
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
