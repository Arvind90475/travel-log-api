require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    await User.create({
      email: process.env.DEFAULT_ADMIN_USER_EMAIL,
      password: await bcrypt.hash(process.env.DEFAULT_ADMIN_USER_PASSWORD, 8),
      role: "admin",
    });
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

seedAdmin();
