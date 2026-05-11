const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, idNumber, password }) => {
  if (!name || !idNumber || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ idNumber });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    idNumber,
    password,
  });

  return {
    _id: user._id,
    name: user.name,
    idNumber: user.idNumber,
    role: user.role,
  };
};

const loginUser = async ({ idNumber, password }) => {
  if (!idNumber || !password) {
    const error = new Error("IdNumber and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ idNumber });

  if (!user) {
    const error = new Error("תעודת הזהות לא קיימת במערכת");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("הסיסמה אינה תואמת לתעודת הזהות");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      idNumber: user.idNumber,
      role: user.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};