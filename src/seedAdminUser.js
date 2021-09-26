require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    await User.create({
      email: "arvind.bisht.90475@gmail.com",
      password: await bcrypt.hash("secretPassword", 8),
      role: "admin",
    });
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

seedAdmin();
