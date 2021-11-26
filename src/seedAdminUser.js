require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    const email = process.env.DEFAULT_ADMIN_USER_EMAIL;
    const isExistingUser = await User.find({ email });
    if (isExistingUser) {
      throw new Error("User already exists");
    }
    await User.create({
      email,
      password: await bcrypt.hash(process.env.DEFAULT_ADMIN_USER_PASSWORD, 8),
      role: "admin",
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    process.exit();
  }
};

seedAdmin();
