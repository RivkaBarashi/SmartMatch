const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const TOKEN_EXPIRES_IN = "7d";

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  idNumber: user.idNumber,
  email: user.email,
  role: user.role,
});

const register = async (req, res) => {
  try {
    const { name, idNumber, email, password } = req.body || {};
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedIdNumber = idNumber?.trim();

    if (!name || !normalizedIdNumber || !password) {
      return res.status(400).json({ message: "Name, ID number and password are required" });
    }

    const duplicateChecks = [
      { idNumber: normalizedIdNumber },
    ];

    if (normalizedEmail) {
      duplicateChecks.push({ email: normalizedEmail });
    }

    const existingUser = await User.findOne({ $or: duplicateChecks });

    if (existingUser) {
      const isSameUserRetry = await bcrypt.compare(password, existingUser.password);

      if (isSameUserRetry) {
        const token = jwt.sign(
          { userId: existingUser._id, role: existingUser.role },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRES_IN }
        );

        return res.status(200).json({
          message: "User already exists",
          token,
          user: buildUserResponse(existingUser),
        });
      }

      const duplicateField = existingUser.idNumber === normalizedIdNumber ? "ID number" : "Email";
      return res.status(400).json({ message: `${duplicateField} already exists. Please use different credentials or login.` });
    }

    const user = await User.create({
      name: name.trim(),
      idNumber: normalizedIdNumber,
      email: normalizedEmail || undefined,
      password,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || "User";
      return res.status(400).json({ message: `${duplicateField} already exists` });
    }

    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { idNumber, identifier, password } = req.body || {};
    const loginValue = (identifier || idNumber)?.trim();
    const normalizedIdNumber = loginValue;

    if (!normalizedIdNumber || !password) {
      return res.status(400).json({ message: "ID number and password are required" });
    }

    const user = await User.findOne({ idNumber: normalizedIdNumber });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User data retrieved successfully",
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
