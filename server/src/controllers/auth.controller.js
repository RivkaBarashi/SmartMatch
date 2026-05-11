const User = require("../models/user.model");
const Preference = require("../models/preference.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const {
      name,
      id,
      email,
      password,
      gender,
      age,
      yeshiva,
      financialRequirement,
      seminar,
      occupation,
      financialCapabilities,
      style,
      city,
      ethnicity,
      appearance,
      height,
      description,
      ageMin,
      ageMax,
      heightMin,
      heightMax,
      preferenceStyle,
      preferenceEthnicity,
      preferenceAppearance,
    } = req.body || {};

    if (!name || !id || !email || !password || !gender) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const existingUser = await User.findOne({ $or: [{ id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID or email already exists' });
    }

    const resumePDFPath = req.files?.resumePDF?.[0]?.path;
    const profileImagePath = req.files?.profileImage?.[0]?.path;

    const user = await User.create({
      name,
      id,
      email,
      password,
      gender,
      age: age ? parseInt(age) : undefined,
      yeshiva: gender === 'male' ? yeshiva : undefined,
      financialRequirement: gender === 'male' ? financialRequirement : undefined,
      seminar: gender === 'female' ? seminar : undefined,
      occupation: gender === 'female' ? occupation : undefined,
      financialCapabilities: gender === 'female' ? financialCapabilities : undefined,
      style,
      city,
      ethnicity,
      appearance,
      height: height ? parseInt(height) : undefined,
      description,
      resumePDF: resumePDFPath,
      profileImage: profileImagePath,
    });

    const hasPreferences = [
      ageMin,
      ageMax,
      preferenceStyle,
      preferenceEthnicity,
      preferenceAppearance,
      heightMin,
      heightMax,
    ].some(value => value !== undefined && value !== null && value !== '');

    if (hasPreferences) {
      await Preference.create({
        user: user._id,
        ageMin: ageMin ? parseInt(ageMin) : undefined,
        ageMax: ageMax ? parseInt(ageMax) : undefined,
        style: preferenceStyle || undefined,
        ethnicity: preferenceEthnicity || undefined,
        appearance: preferenceAppearance || undefined,
        heightMin: heightMin ? parseInt(heightMin) : undefined,
        heightMax: heightMax ? parseInt(heightMax) : undefined,
      });
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      return res.status(400).json({ message: `Duplicate key error: ${field} already exists` });
    }
    res.status(500).json({ message: error.message });
  }
};
     
const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ message: "Id and password are required" });
    }
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(401).json({ message: "תעודת הזהות לא קיימת במערכת" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "הסיסמה אינה תואמת לתעודת הזהות" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        id: user.id,
        role: user.role,
      },
    });
  }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      message: "Protected route works",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
